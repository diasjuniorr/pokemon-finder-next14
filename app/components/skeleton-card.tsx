export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-4 rounded-lg shadow-md bg-white">
      <div className="animate-pulse flex justify-between items-center mb-4">
        <div className="w-3/4 h-6 bg-gray-300 rounded"></div>
        <div className="w-1/4 h-4 bg-gray-200 rounded"></div>
      </div>
      <div className="px-1 pb-2">
        <div className="flex">
          <div className="w-16 h-6 bg-gray-200 rounded-full mr-2 mb-2"></div>
          <div className="w-16 h-6 bg-gray-200 rounded-full mb-2"></div>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-32 h-32 bg-gray-300 animate-pulse rounded"></div>
      </div>
    </div>
  );
};
