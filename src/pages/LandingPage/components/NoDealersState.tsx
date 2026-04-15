import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

type NoDealersStateProps = {
  onRefresh: () => void;
};

const NoDealersState = ({ onRefresh }: NoDealersStateProps) => {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center text-center gap-4">
      <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
        <MapPin className="w-6 h-6 text-green-700" strokeWidth={1.6} />
      </div>
      <div className="space-y-1">
        <p className="text-[15px] font-medium text-foreground">
          No dealer available
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[200px]">
          You have no dealers to visit right now. Check back soon or pull to
          refresh.
        </p>
      </div>
      <Button
        variant="outline"
        onClick={onRefresh}
        className="w-full max-w-[180px]"
      >
        Refresh
      </Button>
      {/* <div className="flex items-start gap-2 bg-muted rounded-xl px-3 py-2.5 text-left max-w-[260px]">
        <CheckCircle
          className="w-4 h-4 text-green-600 mt-0.5 shrink-0"
          strokeWidth={1.6}
        />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          New deliveries will appear here once your manager assigns them.
        </p>
      </div> */}
    </div>
  );
};

export default NoDealersState;
