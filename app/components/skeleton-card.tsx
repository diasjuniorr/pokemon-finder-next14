export const SkeletonCard = () => (
  <div className="bg-gray-200 p-4 rounded-lg animate-pulse">
    <div className="h-20 bg-gray-300 mb-4 rounded-md"></div>
    <div className="flex justify-center">
      <div className="h-40 w-40 bg-gray-300 rounded-full"></div>
    </div>
    <div className="mt-4">
      <div className="h-4 bg-gray-300 mb-2 rounded-md"></div>
      <div className="h-4 bg-gray-300 mb-2 rounded-md"></div>
      <div className="h-4 bg-gray-300 mb-2 rounded-md"></div>
      <div className="h-4 bg-gray-300 mb-2 rounded-md"></div>
      <div className="h-4 bg-gray-300 mb-2 rounded-md"></div>
      <div className="h-4 bg-gray-300 mb-2 rounded-md"></div>
    </div>
  </div>
);
