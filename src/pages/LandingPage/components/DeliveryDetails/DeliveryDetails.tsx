import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { Dealer } from "@/schemas/dealerSchema";
import DeliveryForm from "./DeliveryForm";
import { DeliverySubmitResponseView } from "./DeliverySubmitResponseView";

type DeliveryDetailsProps = {
  dealer: Dealer;
  openHomePage: () => void;
};

export default function DeliveryDetails({
  dealer,
  openHomePage,
}: DeliveryDetailsProps) {
  const [submitResponseViewActive, setSubmitResponseViewActive] =
    useState(false);

  if (submitResponseViewActive) {
    return (
      <DeliverySubmitResponseView
        dealer={dealer}
        onHomeButtonClick={openHomePage}
      />
    );
  }
  return (
    <>
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <div className="flex-shrink-0 sticky top-0 z-10">
          <div
            style={{ background: "#FFC107" }}
            className="px-4 py-3 flex items-center gap-3"
          >
            <button
              onClick={openHomePage}
              className="flex items-center gap-1 text-sm font-medium text-black/80 hover:text-black cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex-1">
              {/* <p className="text-[11px] text-black/55">Delivery form</p> */}
              <p className="text-[15px] font-semibold text-black leading-tight truncate">
                {dealer.CustName}
              </p>
            </div>
          </div>
        </div>
        <div className="px-2 flex-1 overflow-y-auto flex flex-col">
          <div className="flex flex-col h-full">
            <div className="my-3 px-4 py-3 bg-card border-b border-border">
              <p className="text-[13px] font-medium text-foreground">
                {/* {dealer.address} */}
                15-B, Industrial Area Phase 2
              </p>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                {/* {dealer.load} */}5 crates · 40 units
              </p>
            </div>
            <div className="h-full flex flex-col">
              <DeliveryForm
                openHomePage={openHomePage}
                openDeliverySubmitResponseView={() =>
                  setSubmitResponseViewActive(true)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
