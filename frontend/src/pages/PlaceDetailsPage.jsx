import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CloudSun, Clock3, Heart, Loader2, MapPinned, Star, Ticket, Wind, X, ExternalLink } from 'lucide-react';
import { attractionApi } from '../lib/api';
import { attractionImage, pseudoRating } from '../lib/mock';
import { fetchCurrentWeatherForAttraction } from '../lib/weather';
import PageTransition from '../components/PageTransition';

export default function PlaceDetailsPage() {
  const { id } = useParams();
  const [attraction, setAttraction] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState('');
  const [weather, setWeather] = useState(undefined);
  
  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Favorites state
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const listResponse = await attractionApi.list();
        const place = (listResponse.data || []).find((item) => item._id === id);
        setAttraction(place || null);

        if (place?._id) {
          const reviewResponse = await attractionApi.reviews(place._id);
          setReviews(reviewResponse.data || []);
          
          // Check if it's already in favorites
          try {
            const favRes = await attractionApi.favorites();
            if (favRes.data && favRes.data.some(f => f._id === place._id)) {
              setIsSaved(true);
            }
          } catch (e) {
            // ignore
          }
        }
      } catch {
        setError('Login required to view this place and reviews.');
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (!attraction) return;

    let cancelled = false;

    const loadWeather = async () => {
      const weatherData = await fetchCurrentWeatherForAttraction(attraction);
      if (!cancelled) {
        setWeather(weatherData);
      }
    };

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, [attraction]);

  const mapQuery = useMemo(() => {
    if (!attraction) return '';
    return encodeURIComponent(`${attraction.name}, ${attraction.cityName}`);
  }, [attraction]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    try {
      const formData = new FormData();
      formData.append('attractionId', attraction._id);
      formData.append('rating', reviewRating);
      formData.append('comment', reviewComment);
      if (reviewImage) {
        formData.append('image', reviewImage);
      }

      await attractionApi.addReview(formData);
      // Reload reviews to show the new one with user details populated
      const reviewResponse = await attractionApi.reviews(attraction._id);
      setReviews(reviewResponse.data || []);
      setReviewComment('');
      setReviewRating(5);
      setReviewImage(null);
    } catch (err) {
      console.error(err);
      alert('Failed to submit review. Please ensure you are logged in.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isSaved) {
        await attractionApi.removeFavorite(attraction._id);
        setIsSaved(false);
      } else {
        await attractionApi.addFavorite(attraction._id);
        setIsSaved(true);
      }
    } catch (e) {
      alert("Failed to update favorites. Please log in first.");
    } finally {
      setSaving(false);
    }
  };

  if (!attraction) {
    return (
      <PageTransition>
        <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[22px] bg-white p-8 text-slate-600 shadow-soft">
            {error || 'Loading place details...'}
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* Fullscreen Image Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute right-6 top-6 text-white/70 transition hover:text-white">
              <X className="h-8 w-8" />
            </button>
            <img
              src={typeof isLightboxOpen === 'string' ? isLightboxOpen : (attraction.imageUrl || attractionImage(attraction.name))}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <article className="overflow-hidden rounded-[24px] bg-white shadow-soft">
          <div 
            className="group relative cursor-pointer overflow-hidden" 
            onClick={() => setIsLightboxOpen(true)}
          >
            <img
              src={attraction.imageUrl || attractionImage(attraction.name)}
              alt={attraction.name}
              className="h-[38vh] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[44vh]"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100 flex items-center justify-center">
              <span className="rounded-full bg-white/20 px-4 py-2 backdrop-blur-md text-white font-medium shadow-lg">Click to enlarge</span>
            </div>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[1.4fr_1fr] lg:p-8">
            <div>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-brand-ink">{attraction.name}</h1>
                  <p className="mt-2 text-slate-500">{attraction.cityName}</p>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={saving}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isSaved 
                      ? 'bg-rose-500 text-white hover:bg-rose-600' 
                      : 'bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-50'
                  }`}
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />} 
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>

              <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {pseudoRating(attraction._id)}
              </div>

              <p className="mt-6 leading-7 text-slate-600">{attraction.description}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-2 inline-flex items-center gap-2 font-medium text-brand-ink">
                    <Clock3 className="h-4 w-4 text-brand-accent" /> Timings
                  </p>
                  <p className="text-sm text-slate-500">09:00 AM - 08:00 PM</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="mb-2 inline-flex items-center gap-2 font-medium text-brand-ink">
                    <Ticket className="h-4 w-4 text-brand-accent" /> Ticket Price
                  </p>
                  <p className="text-sm text-slate-500">₹1,000 - ₹3,500 per person</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 sm:col-span-2">
                  <p className="mb-2 inline-flex items-center gap-2 font-medium text-brand-ink">
                    <CloudSun className="h-4 w-4 text-brand-accent" /> Live Weather
                  </p>
                  {weather === undefined ? (
                    <p className="text-sm text-slate-500">Loading weather...</p>
                  ) : weather ? (
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                      <span className="rounded-full bg-white px-3 py-1 font-medium text-slate-700">
                        {Math.round(weather.temperature)}C
                      </span>
                      <span>{weather.conditionLabel}</span>
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Wind className="h-3.5 w-3.5" /> {Math.round(weather.windSpeed)} km/h
                      </span>
                      <span className="text-slate-500">Feels like {Math.round(weather.feelsLike)}C</span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">Weather data is currently unavailable for this place.</p>
                  )}
                </div>
              </div>

              <div className="mt-10">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-semibold text-brand-ink">Reviews</h2>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-bold text-brand-ink">
                      {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 'New'}
                    </span>
                    <span className="text-sm text-slate-500">({reviews.length})</span>
                  </div>
                </div>

                {/* Google Maps Style Review Form */}
                <div className="mt-6 rounded-2xl bg-slate-50 p-5 border border-slate-100 shadow-inner">
                  <h3 className="text-sm font-semibold text-brand-ink mb-3">Rate your experience</h3>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="focus:outline-none transition hover:scale-110"
                        >
                          <Star className={`h-8 w-8 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share details of your own experience at this place"
                      className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-brand-ink outline-none transition focus:border-brand-accent resize-none h-24 mb-3"
                      required
                    />
                    
                    {reviewImage && (
                      <div className="relative mb-3 inline-block">
                        <img 
                          src={URL.createObjectURL(reviewImage)} 
                          alt="Review preview" 
                          className="h-20 w-20 rounded-lg object-cover border border-slate-200" 
                        />
                        <button
                          type="button"
                          onClick={() => setReviewImage(null)}
                          className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full p-1 hover:bg-slate-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-brand-accent hover:text-blue-600 font-medium">
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setReviewImage(e.target.files[0]);
                            }
                          }} 
                        />
                        + Add a photo
                      </label>
                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="rounded-full bg-brand-accent px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                      >
                        {submittingReview && <Loader2 className="h-4 w-4 animate-spin" />}
                        Post Review
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6 space-y-6">
                  {reviews.length ? (
                    reviews.map((review) => (
                      <div key={review._id} className="flex gap-4">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold text-lg uppercase shadow-sm">
                          {(review.user?.name || 'T')[0]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-brand-ink">{review.user?.name || 'Traveler'}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                            <span className="text-xs text-slate-500">
                              {review.source === 'google' ? 'Google review' : 'App review'}
                            </span>
                            {review.source === 'google' && review.relativeTimeDescription && (
                              <span className="text-xs text-slate-400">{review.relativeTimeDescription}</span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-slate-700 leading-relaxed">{review.comment || 'Great experience.'}</p>
                          
                          {review.imageUrl && (
                            <div className="mt-3">
                              <img 
                                src={`http://localhost:5000${review.imageUrl}`} 
                                alt="Review" 
                                className="h-24 w-24 rounded-lg object-cover cursor-zoom-in border border-slate-200 hover:opacity-90 transition"
                                onClick={() => setIsLightboxOpen(`http://localhost:5000${review.imageUrl}`)}
                              />
                            </div>
                          )}

                          {review.source === 'google' && review.googleAuthorUrl && (
                            <a
                              href={review.googleAuthorUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex text-xs font-medium text-brand-accent hover:underline"
                            >
                              View Google profile
                            </a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 text-center py-8">Be the first to review this place!</p>
                  )}
                </div>
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-brand-ink">
                    <MapPinned className="h-4 w-4 text-brand-accent" /> Google Maps
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-accent hover:underline"
                  >
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <div className="relative h-80 w-full bg-slate-100">
                  {!mapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="inline-flex flex-col items-center gap-2 text-sm text-slate-500">
                        <Loader2 className="h-6 w-6 animate-spin text-brand-accent" /> Loading Map...
                      </span>
                    </div>
                  )}
                  <iframe
                    title="map"
                    src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                    className="h-full w-full border-0"
                    onLoad={() => setMapLoaded(true)}
                  />
                </div>
              </div>
            </aside>
          </div>
        </article>
      </section>
    </PageTransition>
  );
}
