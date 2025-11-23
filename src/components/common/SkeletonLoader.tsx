import React from 'react';

const SkeletonEventCard: React.FC = () => {
  return (
    <div className="card-hover h-full flex flex-col animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-t-lg -mt-6 -mx-6 mb-4"></div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-16 ml-2"></div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-40"></div>
      </div>
    </div>
  );
};

export const SkeletonEventList: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonEventCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonEventCard;
