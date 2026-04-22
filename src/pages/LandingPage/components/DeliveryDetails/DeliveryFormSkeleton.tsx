import { Skeleton } from "@/components/ui/skeleton";

const DeliveryFormSkeleton = () => {
  return (
    <div className="flex flex-col min-h-full h-full bg-card p-4 gap-4">
      <Skeleton className="h-3" />

      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-25" />
        <Skeleton className="h-25" />
      </div>
      <Skeleton className="h-25" />
      <Skeleton className="h-8" />
      <Skeleton className="h-8" />
    </div>
  );
};

export default DeliveryFormSkeleton;
