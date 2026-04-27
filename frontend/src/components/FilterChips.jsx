export default function FilterChips({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-brand-ink dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
