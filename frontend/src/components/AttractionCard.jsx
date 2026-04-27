import { motion } from 'framer-motion';
import { CloudSun, Heart, Hotel, MapPin, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { attractionImage, pseudoRating } from '../lib/mock';

export default function AttractionCard({ attraction, compact = false, onSave, saved = false, weather, distanceKm = null }) {
  const navigate = useNavigate();

  const handleBookHotel = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/hotels?search=${encodeURIComponent(attraction.cityName)}`);
  };

  return (
    <Link to={`/places/${attraction._id}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        whileHover={{ y: -6, scale: 1.015 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="group overflow-hidden rounded-[22px] border border-slate-200/60 bg-white shadow-soft transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800"
      >
        <div className={`relative overflow-hidden ${compact ? 'h-44' : 'h-56'}`}>
          <img
            src={attraction.imageUrl || attractionImage(attraction.name)}
            alt={attraction.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-sky-300/0 via-sky-300/10 to-amber-200/0 opacity-0 transition duration-500 group-hover:opacity-100" />
          {onSave && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave(attraction._id, saved);
              }}
              className="absolute right-3 top-3 z-10 rounded-full bg-white/80 p-2 text-rose-500 backdrop-blur-sm transition hover:bg-rose-500 hover:text-white"
            >
              <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <div className="space-y-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold text-brand-ink dark:text-white">{attraction.name}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {pseudoRating(attraction._id)}
            </span>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">{attraction.cityName}</p>
          {typeof distanceKm === 'number' && (
            <p className="inline-flex items-center gap-1.5 text-xs text-brand-accent">
              <MapPin className="h-3.5 w-3.5" /> {distanceKm.toFixed(1)} km away
            </p>
          )}
          <p className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <CloudSun className="h-3.5 w-3.5" />
            {weather === undefined
              ? 'Loading weather...'
              : weather
                ? `${Math.round(weather.temperature)}C, ${weather.conditionLabel}`
                : 'Weather unavailable'}
          </p>
          <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{attraction.description}</p>

          <div className="flex items-center justify-between gap-2">
            <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300">
              {attraction.category}
            </span>
            <button
              type="button"
              onClick={handleBookHotel}
              className="inline-flex items-center gap-1 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-2.5 py-1 text-[11px] font-semibold text-brand-accent transition hover:scale-[1.03] hover:bg-brand-accent hover:text-white"
            >
              <Hotel className="h-3.5 w-3.5" />
              Book Hotel
            </button>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
