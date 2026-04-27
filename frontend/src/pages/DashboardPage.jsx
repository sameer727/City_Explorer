import { useEffect, useMemo, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { attractionApi } from '../lib/api';
import PageTransition from '../components/PageTransition';
import SearchBar from '../components/SearchBar';
import AttractionCard from '../components/AttractionCard';
import SkeletonCard from '../components/SkeletonCard';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const [attractions, setAttractions] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  useEffect(() => {
    attractionApi
      .list()
      .then((response) => setAttractions(response.data || []))
      .catch(() => setError('Failed to load attractions. Please check your connection.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return attractions.filter((item) => {
      const bySearch = `${item.name} ${item.cityName}`
        .toLowerCase()
        .includes(search.toLowerCase());
      return bySearch;
    });
  }, [attractions, search]);

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-brand-ink dark:text-white">Dashboard</h1>
        <p className="mt-2 text-slate-500">Explore amazing attractions around the world.</p>

        <div className="mt-7">
          <SearchBar value={search} onChange={setSearch} placeholder="Search attractions by name or city" />
        </div>

        {error ? <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">{error}</div> : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : filtered.map((attraction) => (
                <AttractionCard
                  key={attraction._id}
                  attraction={attraction}
                />
              ))}
        </div>
      </section>
    </PageTransition>
  );
}