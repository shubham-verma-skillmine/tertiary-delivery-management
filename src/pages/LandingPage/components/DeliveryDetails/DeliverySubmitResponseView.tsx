import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dealer } from "@/schemas/dealerSchema";

type DeliverySubmitResponseViewProps = {
  dealer: Dealer;
  onHomeButtonClick: () => void;
};

export const DeliverySubmitResponseView = ({
  dealer,
  onHomeButtonClick,
}: DeliverySubmitResponseViewProps) => {
  return (
    <div className="h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
        style={{ background: "#FFF8E1" }}
      >
        <CheckCircle2 size={40} style={{ color: "#FFC107" }} />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Delivery submitted!
      </h2>
      <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xs">
        <strong>{dealer.CustName}</strong> marked as delivered.
      </p>
      <Button
        onClick={onHomeButtonClick}
        className="px-7 py-5 text-base font-semibold text-black"
        style={{ background: "#FFC107" }}
      >
        Back to home page
      </Button>
    </div>
  );
};
