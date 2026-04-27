import { useEffect, useMemo, useState } from 'react';
import { Loader2, MapPinned, Navigation } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { attractionApi } from '../lib/api';
import PageTransition from '../components/PageTransition';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import AttractionCard from '../components/AttractionCard';
import SkeletonCard from '../components/SkeletonCard';
import { categories } from '../lib/mock';
import { getDistanceKm } from '../lib/location';
import { fetchCoordinatesForAttraction, fetchCurrentWeatherForAttraction } from '../lib/weather';

export default function AttractionsPage() {
  const [searchParams] = useSearchParams();

  const parsedRadius = Number(searchParams.get('radius'));
  const initialRadius = Number.isFinite(parsedRadius)
    ? Math.min(100, Math.max(5, parsedRadius))
    : 25;

  const [attractions, setAttractions] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weatherByAttractionId, setWeatherByAttractionId] = useState({});
  const [locationByAttractionId, setLocationByAttractionId] = useState({});
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [nearbyOnly, setNearbyOnly] = useState(searchParams.get('nearby') === '1');
  const [radiusKm, setRadiusKm] = useState(initialRadius);

  useEffect(() => {
    attractionApi
      .list()
      .then((response) => setAttractions(response.data || []))
      .catch(() => setError('Please login to load attractions from protected API.'))
      .finally(() => setLoading(false));

    attractionApi
      .favorites()
      .then((response) => setFavorites((response.data || []).map((item) => item._id)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!attractions.length) return;

    let cancelled = false;

    const loadWeather = async () => {
      const entries = await Promise.all(
        attractions.map(async (attraction) => {
          const weather = await fetchCurrentWeatherForAttraction(attraction);
          return [attraction._id, weather];
        })
      );

      if (!cancelled) {
        setWeatherByAttractionId(Object.fromEntries(entries));
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [attractions]);

  useEffect(() => {
    if (!attractions.length) return;

    let cancelled = false;

    const loadCoordinates = async () => {
      const entries = await Promise.all(
        attractions.map(async (attraction) => {
          const location = await fetchCoordinatesForAttraction(attraction);
          return [attraction._id, location];
        })
      );

      if (!cancelled) {
        setLocationByAttractionId(Object.fromEntries(entries));
      }
    };

    loadCoordinates();

    return () => {
      cancelled = true;
    };
  }, [attractions]);

  const onSave = async (attractionId, isCurrentlySaved) => {
    try {
      if (isCurrentlySaved) {
        await attractionApi.removeFavorite(attractionId);
        setFavorites((previous) => previous.filter(id => id !== attractionId));
      } else {
        await attractionApi.addFavorite(attractionId);
        setFavorites((previous) => [...new Set([...previous, attractionId])]);
      }
    } catch {
      setError('Login required to update favorites.');
    }
  };

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
    if (searchParams.get('autoLocate') === '1' && !userLocation && !locating) {
      handleUseMyLocation();
    }
  }, [locating, searchParams, userLocation]);

  const filtered = useMemo(() => {
    const withDistance = attractions.map((item) => {
      const point = locationByAttractionId[item._id];
      const distanceKm = userLocation && point
        ? getDistanceKm(
            userLocation.latitude,
            userLocation.longitude,
            point.latitude,
            point.longitude
          )
        : null;

      return {
        ...item,
        distanceKm
      };
    });

    const result = withDistance.filter((item) => {
      const bySearch = `${item.name} ${item.description} ${item.cityName}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const byCategory = category === 'All' || item.category.toLowerCase() === category.toLowerCase();
      const byNearby = !nearbyOnly
        || (typeof item.distanceKm === 'number' && item.distanceKm <= radiusKm);
      return bySearch && byCategory && byNearby;
    });

    if (!userLocation) {
      return result;
    }

    return [...result].sort((a, b) => {
      if (typeof a.distanceKm !== 'number' && typeof b.distanceKm !== 'number') return 0;
      if (typeof a.distanceKm !== 'number') return 1;
      if (typeof b.distanceKm !== 'number') return -1;
      return a.distanceKm - b.distanceKm;
    });
  }, [attractions, category, locationByAttractionId, nearbyOnly, radiusKm, search, userLocation]);

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-brand-ink dark:text-white">Attractions</h1>
        <p className="mt-2 text-slate-500">Filter by category, rating feel, and destination mood.</p>

        <div className="mt-7 space-y-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search attractions by name or city" />
          <FilterChips options={categories} value={category} onChange={setCategory} />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-ink">
                  <MapPinned className="h-4 w-4 text-brand-accent" /> Discover nearby places
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Find attractions around your current location and sort by nearest first.
                </p>
              </div>

              <button
                onClick={handleUseMyLocation}
                disabled={locating}
                className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
                {locating ? 'Locating...' : userLocation ? 'Location enabled' : 'Use my location'}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4">
              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={nearbyOnly}
                  onChange={(e) => setNearbyOnly(e.target.checked)}
                  disabled={!userLocation}
                  className="h-4 w-4 rounded border-slate-300 text-brand-accent focus:ring-brand-accent disabled:cursor-not-allowed"
                />
                Show only nearby
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                Radius
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(Number(e.target.value))}
                  disabled={!userLocation}
                  className="w-32"
                />
                <span className="inline-flex min-w-14 justify-end font-medium text-brand-ink">{radiusKm} km</span>
              </label>
            </div>

            {locationError && <p className="mt-3 text-sm text-rose-600">{locationError}</p>}
          </div>
        </div>

        {error ? <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">{error}</div> : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : filtered.map((attraction) => (
                <AttractionCard
                  key={attraction._id}
                  attraction={attraction}
                  onSave={onSave}
                  saved={favorites.includes(attraction._id)}
                  weather={weatherByAttractionId[attraction._id]}
                  distanceKm={attraction.distanceKm}
                />
              ))}
        </div>
      </section>
    </PageTransition>
  );
}
