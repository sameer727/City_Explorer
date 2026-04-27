import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { cityImage } from '../lib/mock';

export default function CityCard({ city, onClick, onImageClick }) {
  return (
    <motion.article
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`group overflow-hidden rounded-[22px] border border-slate-200/60 bg-white shadow-soft transition-shadow hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div 
        className={`relative h-56 overflow-hidden ${onImageClick ? 'cursor-zoom-in' : ''}`}
        onClick={(e) => {
          if (onImageClick) {
            e.stopPropagation();
            onImageClick();
          }
        }}
      >
        <img
          src={city.imageUrl || cityImage(city.cityName)}
          alt={city.cityName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-300/0 via-sky-300/10 to-amber-200/0 opacity-0 transition duration-500 group-hover:opacity-100" />
      </div>

      <div className="space-y-2 p-5">
        <h3 className="font-display text-lg font-semibold text-brand-ink dark:text-white">{city.cityName}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <p className="flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4" /> {city.country}
          </p>
          {city.tier && (
            <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-accent">
              {city.tier}
            </span>
          )}
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{city.description}</p>
      </div>
    </motion.article>
  );
}
