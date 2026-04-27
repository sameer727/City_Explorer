import { useEffect, useState } from 'react';
import { attractionApi } from '../lib/api';
import PageTransition from '../components/PageTransition';
import AttractionCard from '../components/AttractionCard';
import SkeletonCard from '../components/SkeletonCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    attractionApi
      .favorites()
      .then((response) => setFavorites(response.data || []))
      .catch(() => setError('Login required to view favorites.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-brand-ink dark:text-white">Favorites & Bookmarks</h1>
        <p className="mt-2 text-slate-500">Your saved places in one elegant list.</p>

        {error ? <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">{error}</div> : null}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />)
            : favorites.map((item) => (
                <AttractionCard 
                  key={item._id} 
                  attraction={item} 
                  compact 
                  saved={true}
                  onSave={async (id) => {
                    try {
                      await attractionApi.removeFavorite(id);
                      setFavorites((prev) => prev.filter((fav) => fav._id !== id));
                    } catch (e) {
                      setError('Failed to remove from favorites.');
                    }
                  }}
                />
              ))}
        </div>
      </section>
    </PageTransition>
  );
}
