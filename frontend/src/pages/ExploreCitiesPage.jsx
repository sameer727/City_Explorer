import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MapPinned, Navigation, X } from 'lucide-react';
import { attractionApi, cityApi } from '../lib/api';
import SearchBar from '../components/SearchBar';
import AttractionCard from '../components/AttractionCard';
import CityCard from '../components/CityCard';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/PageTransition';
import { countries, cityImage } from '../lib/mock';
import { getDistanceKm } from '../lib/location';
import { fetchCoordinatesForAttraction } from '../lib/weather';

export default function ExploreCitiesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cities, setCities] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAttractions, setLoadingAttractions] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [country, setCountry] = useState('All');
  const [tier, setTier] = useState('All');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [nearbyAttractions, setNearbyAttractions] = useState([]);
  
  // Lightbox state
  const [lightboxCity, setLightboxCity] = useState(null);

  useEffect(() => {
    cityApi
      .list()
      .then((response) => setCities(response.data || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    attractionApi
      .list()
      .then((response) => setAttractions(response.data || []))
      .catch(() => setAttractions([]))
      .finally(() => setLoadingAttractions(false));
  }, []);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Your browser does not support geolocation.');
      return;
    }

    setLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocating(false);
      },
      () => {
        setLocationError('Unable to fetch your location. Please allow location access.');
        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  useEffect(() => {
    if (!userLocation || !attractions.length) {
      setNearbyAttractions([]);
      return;
    }

    let cancelled = false;

    const buildNearby = async () => {
      const mapped = await Promise.all(
        attractions.map(async (attraction) => {
          const point = await fetchCoordinatesForAttraction(attraction);
          if (!point) return null;

          return {
            ...attraction,
            distanceKm: getDistanceKm(
              userLocation.latitude,
              userLocation.longitude,
              point.latitude,
              point.longitude
            )
          };
        })
      );

      const sorted = mapped
        .filter(Boolean)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 6);

      if (!cancelled) {
        setNearbyAttractions(sorted);
      }
    };

    buildNearby();

    return () => {
      cancelled = true;
    };
  }, [attractions, userLocation]);

  const filtered = useMemo(() => {
    return cities.filter((city) => {
      const bySearch = `${city.cityName} ${city.description}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const byCountry = country === 'All' || city.country === country;
      const byTier = tier === 'All' || city.tier === tier;
      return bySearch && byCountry && byTier;
    });
  }, [cities, search, country, tier]);

  return (
    <>
      {/* Fullscreen Image Lightbox — outside PageTransition to avoid animation interference */}
      <AnimatePresence>
        {lightboxCity && (
          <motion.div
            key="city-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/92 p-4 backdrop-blur-md"
            onClick={() => setLightboxCity(null)}
          >
            <button
              className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
              onClick={() => setLightboxCity(null)}
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={lightboxCity.imageUrl || cityImage(lightboxCity.cityName)}
              alt={lightboxCity.cityName}
              className="max-h-[80vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-center" onClick={(e) => e.stopPropagation()}>
              <p className="text-xl font-semibold text-white">{lightboxCity.cityName}</p>
              <p className="mt-1 text-sm text-white/60">{lightboxCity.country} {lightboxCity.tier ? `· ${lightboxCity.tier}` : ''}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageTransition>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">City Directory</p>
        <h1 className="mt-2 text-4xl font-bold text-brand-ink dark:text-white">Explore Cities</h1>
        <p className="mt-3 max-w-2xl text-slate-500">Search by vibe, destination, or country.</p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink dark:text-slate-100">
              <MapPinned className="h-4 w-4 text-brand-accent" /> Nearby Tourist Places
            </p>

            <button
              onClick={handleUseMyLocation}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
              {locating ? 'Locating...' : userLocation ? 'Location enabled' : 'Use my location'}
            </button>
          </div>

          {locationError ? <p className="mt-3 text-sm text-rose-600">{locationError}</p> : null}

          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loadingAttractions ? (
              Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            ) : !userLocation ? (
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:col-span-2 xl:col-span-3">
                Enable location access to see the nearest tourist places around you.
              </div>
            ) : nearbyAttractions.length ? (
              nearbyAttractions.map((attraction) => (
                <AttractionCard key={attraction._id} attraction={attraction} distanceKm={attraction.distanceKm} />
              ))
            ) : (
              <div className="rounded-[20px] border border-slate-200 bg-white p-6 text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:col-span-2 xl:col-span-3">
                No nearby tourist places found right now. Try again in a moment.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-[24px] border border-slate-200/70 bg-white/80 p-4 shadow-soft backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/60">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <SearchBar value={search} onChange={setSearch} placeholder="Search city or description" />

            <div className="flex gap-2">
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {countries.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <select
                value={tier}
                onChange={(event) => setTier(event.target.value)}
                className="rounded-[18px] border border-slate-200 bg-white px-4 py-3 text-sm text-brand-ink outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              >
                {['All', 'Tier 1', 'Tier 2', 'Tier 3', 'Tier 4'].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} tall />)
            : filtered.map((city) => (
                <CityCard 
                  key={city._id} 
                  city={city} 
                  onImageClick={() => setLightboxCity(city)}
                  onClick={() => navigate(`/dashboard?search=${encodeURIComponent(city.cityName)}`)}
                />
              ))}
        </div>
      </section>
      </PageTransition>
    </>
  );
}
