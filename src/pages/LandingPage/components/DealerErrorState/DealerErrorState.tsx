import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type DealerErrorStateProps = {
  onRetry: () => void;
};

const DealerErrorState = ({ onRetry }: DealerErrorStateProps) => {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center text-center px-6 gap-4">
      <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
        <AlertTriangle className="w-6 h-6 text-red-600" strokeWidth={1.6} />
      </div>
      <div className="space-y-1">
        <p className="text-[15px] font-medium text-foreground">
          Couldn't load dealers
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[200px]">
          Something went wrong connecting to the server. Check your internet and
          try again.
        </p>
      </div>
      <Button
        onClick={onRetry}
        className="bg-red-500 hover:bg-red-600 text-white w-full max-w-[180px]"
      >
        Retry
      </Button>
      {/* <div className="flex items-start gap-2 bg-muted rounded-xl px-3 py-2.5 text-left max-w-[260px]">
        <Info
          className="w-4 h-4 text-amber-500 mt-0.5 shrink-0"
          strokeWidth={1.6}
        />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          If the problem persists, contact your supervisor or call support.
        </p>
      </div> */}
    </div>
  );
};

export default DealerErrorState;
