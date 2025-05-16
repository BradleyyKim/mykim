export default function PostSkeleton() {
  return (
    <article className="border rounded-lg overflow-hidden flex flex-col">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse ml-2"></div>
        </div>

        <div className="flex items-center mb-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse mr-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse mr-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full w-12 animate-pulse"></div>
        </div>
      </div>
    </article>
  );
}
