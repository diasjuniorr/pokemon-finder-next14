import React from "react";

const SkeletonPage: React.FC = () => {
  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="mx-auto px-10 w-fit">
        <h1 className="pt-6 pb-2 mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          Loading Evolution Chain
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-screen-lg">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-lg shadow-md bg-white animate-pulse"
            >
              <div className="h-72 w-44 bg-gray-300 mb-4 rounded"></div>
              <div className="flex">
                <div className="w-1/2 h-4 bg-gray-200 rounded-full mr-2"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded-full"></div>
              </div>
              <div className="mt-4">
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        <h1 className="mb-4 pt-6 pb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-white">
          Loading Other Info
        </h1>
        <div className="flex flex-col gap-4 pb-10 md:flex-row md:gap-4">
          <div className="p-4 rounded-lg shadow-md bg-white animate-pulse">
            <div className="h-20 w-72 bg-gray-300 mb-4 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-white animate-pulse">
            <div className="h-20 w-72 bg-gray-300 mb-4 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonPage;
