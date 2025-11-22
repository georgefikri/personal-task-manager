export function TaskSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-4 h-4 mt-1 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}
