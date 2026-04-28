import { useState } from "react";
import type { Dealer } from "@/schemas/dealerSchema";
import MainLayout from "@/layouts/MainLayout";
import DealerList from "./components/DealerList";
import DeliveryDetails from "./components/DeliveryDetails";
// import DataTabs from "./components/DataTabs";
import { useDealerQuery } from "@/queries/tertiaryDeliveryQueries";
import { useTripDetail } from "@/contexts/tripDetail";
import DealerListSkeleton from "./components/DealerList/DealerListSkeleton";
import DealerErrorState from "./components/DealerErrorState";
import NoDealersState from "./components";

export default function LandingPage() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  // const [selectedTab, setSelectedTab] = useState("pending");
  const { tripId } = useTripDetail();

  const {
    data: dealers = [],
    isLoading,
    isError,
    refetch,
  } = useDealerQuery({ tripId });

  const handleDealerSelect = (dealerId: string) => {
    const dealer = dealers.find((d) => d.Kunnr === dealerId);
    if (dealer) setSelectedDealer(dealer);
  };

  if (selectedDealer) {
    return (
      <DeliveryDetails
        dealer={selectedDealer}
        openHomePage={() => {
          setSelectedDealer(null);
          refetch();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <DealerListSkeleton />
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <DealerErrorState onRetry={refetch} />
      </MainLayout>
    );
  }

  if (dealers.length < 1) {
    return (
      <MainLayout>
        <NoDealersState onRefresh={refetch} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* <DeliveryStatusStripe
        totalDeliveries={dealers.length}
        delivered={dealers.filter((d) => d.Status === "delivered").length}
        distanceCovered={0}
      /> */}
      {/* <DataTabs
        tabs={[
          {
            label: "Pending",
            value: "pending",
          },
          {
            label: "Completed",
            value: "completed",
          },
        ]}
        activeTab={selectedTab}
        setActiveTab={setSelectedTab}
      /> */}

      <DealerList dealers={dealers} onDealerSelect={handleDealerSelect} />
    </MainLayout>
  );
}
