export function PlanCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card border border-border p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-xl bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        </div>
        <div className="flex gap-1">
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
          <div className="w-9 h-9 rounded-lg bg-gray-200" />
        </div>
      </div>

      <div className="h-8 bg-gray-200 rounded w-32 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-40 mb-4" />

      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>

      <div className="h-12 bg-gray-200 rounded-xl" />
    </div>
  );
}
