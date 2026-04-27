import { Search } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search cities, attractions, vibes...',
  className = ''
}) {
  return (
    <label
      className={`group flex items-center gap-3 rounded-[20px] border border-slate-200/80 bg-white/90 px-5 py-3.5 shadow-soft backdrop-blur-md transition duration-300 focus-within:border-brand-accent/40 focus-within:shadow-glow dark:border-slate-700 dark:bg-slate-900/80 ${className}`}
    >
      <Search className="h-5 w-5 text-slate-500 transition group-focus-within:text-brand-accent" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-brand-ink placeholder:text-slate-500/80 outline-none dark:text-slate-100"
      />
    </label>
  );
}
