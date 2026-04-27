export default function SkeletonCard({ tall = false }) {
  return (
    <div className="overflow-hidden rounded-[20px] bg-white shadow-soft">
      <div className={`animate-pulse bg-slate-200 ${tall ? 'h-56' : 'h-44'}`} />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}
