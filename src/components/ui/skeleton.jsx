import { cn } from "../../lib/utils";

// Base skeleton with pulse animation
const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gray-200",
        className
      )}
      {...props}
    />
  );
};

// Card skeleton for opportunities/requests
const CardSkeleton = () => {
  return (
    <div className="px-4 py-4 border-b border-gray-100">
      <div className="flex gap-3">
        {/* Avatar */}
        <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          {/* Title */}
          <Skeleton className="h-5 w-3/4" />
          
          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          
          {/* Tags */}
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

// List of card skeletons
const CardListSkeleton = ({ count = 3 }) => {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// Profile skeleton
const ProfileSkeleton = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Avatar and name */}
      <div className="flex flex-col items-center">
        <Skeleton className="w-28 h-28 rounded-full mb-4" />
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
      
      {/* Bio */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      
      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
      </div>
    </div>
  );
};

// Sidebar skeleton
const SidebarSkeleton = () => {
  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <Skeleton className="h-11 w-full rounded-2xl" />
      
      {/* Trends box */}
      <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
        <Skeleton className="h-5 w-32" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
};

export { 
  Skeleton, 
  CardSkeleton, 
  CardListSkeleton, 
  ProfileSkeleton,
  SidebarSkeleton 
};
