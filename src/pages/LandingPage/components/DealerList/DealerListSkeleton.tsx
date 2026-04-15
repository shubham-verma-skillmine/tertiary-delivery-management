import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DealerListSkeleton = () => {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
      {Array.from({ length: 7 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-4 py-1 px-3">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="flex-1 min-w-0">
              <Skeleton className="h-3" />
              <Skeleton className="h-3 mt-1 w-4/5" />
              <Skeleton className="h-3 mt-1 w-2/4 " />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DealerListSkeleton;
