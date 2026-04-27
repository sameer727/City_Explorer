import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cityApi, attractionApi } from '../lib/api';
import CityCard from '../components/CityCard';
import AttractionCard from '../components/AttractionCard';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';
import PageTransition from '../components/PageTransition';

const heroImage =
  'https://upload.wikimedia.org/wikipedia/commons/f/f2/Indian_Monuments_%2852%29_22.jpg';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [cities, setCities] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesResponse, attractionsResponse] = await Promise.all([
          cityApi.list(),
          attractionApi.list().catch(() => ({ data: [] }))
        ]);

        setCities(citiesResponse.data || []);
        setAttractions((attractionsResponse.data || []).slice(0, 6));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCities = cities
    .filter((city) => city.cityName.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6);

  const sectionReveal = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.08
      }
    }
  };

  return (
    <PageTransition>
      <section className="relative overflow-hidden">
        <img src={heroImage} alt="City skyline" className="h-[68vh] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-brand-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.24),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(245,158,11,0.2),transparent_28%)]" />
        <div className="absolute inset-x-0 top-1/2 mx-auto flex w-full max-w-5xl -translate-y-1/2 flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-4 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm"
          >
            Premium Travel Discovery
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.5 }}
            className="font-display text-4xl font-bold text-white sm:text-6xl"
          >
            Cities, Stays, and Stories Worth the Trip
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-4 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base"
          >
            Discover handpicked destinations, iconic attractions, and immersive travel stories.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mt-8 w-full max-w-3xl"
          >
            <SearchBar value={search} onChange={setSearch} placeholder="Search your next city getaway" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Explore cities <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/hotels"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
            >
              Book hotels
            </Link>
          </motion.div>
        </div>
      </section>

      <motion.section
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Popular Now</p>
            <h2 className="font-display mt-1 text-3xl font-semibold text-brand-ink dark:text-white">Popular Cities</h2>
          </div>
          <Link to="/explore" className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" variants={sectionReveal}>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} tall />)
          ) : filteredCities.length ? (
            filteredCities.map((city) => (
              <CityCard
                key={city._id}
                city={city}
                onClick={() => navigate(`/explore?search=${encodeURIComponent(city.cityName)}`)}
              />
            ))
          ) : (
            <p className="text-slate-500">No matching cities found.</p>
          )}
        </motion.div>
      </motion.section>

      <motion.section
        className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Curated Picks</p>
            <h2 className="font-display mt-1 text-3xl font-semibold text-brand-ink dark:text-white">Featured Attractions</h2>
          </div>
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-brand-accent">
            Explore more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" variants={sectionReveal}>
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
          ) : attractions.length ? (
            attractions.map((attraction) => <AttractionCard key={attraction._id} attraction={attraction} />)
          ) : (
            <div className="rounded-[20px] border border-slate-200 bg-white p-6 text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              Login first to view protected attractions from the API.
            </div>
          )}
        </motion.div>
      </motion.section>
    </PageTransition>
  );
}
