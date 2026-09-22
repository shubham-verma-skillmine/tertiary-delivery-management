import { useMemo, useState } from "react";
import { BASE_URL } from "@/api/apiClient";
import type { Dealer } from "@/schemas/dealerSchema";
import MainLayout from "@/layouts/MainLayout";
import DealerList from "./components/DealerList";
import DeliveryDetails from "./components/DeliveryDetails";
import { useDealerQuery } from "@/queries/tertiaryDeliveryQueries";
import { useTripDetail } from "@/contexts/tripDetail";
import DealerListSkeleton from "./components/DealerList/DealerListSkeleton";
import DealerErrorState from "./components/DealerErrorState";
import DataTabs from "./components/DataTabs";
// import DeliveryStatusStripe from "./components/DeliveryStatusStripe";

type TabValue = "pending" | "completed";

export default function LandingPage() {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [selectedTab, setSelectedTab] = useState<TabValue>("pending");
  const { tripId } = useTripDetail();

  const {
    data: dealers = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useDealerQuery({
    tripId,
    onSuccess: () => {
      navigator.sendBeacon(
        `${BASE_URL}tertiary/public/serviceprovider/delivery-sessions/current`,
      );
    },
  });

  const handleDealerSelect = (dealerId: string) => {
    if (selectedTab !== "pending") return;

    const dealer = dealers.find((d) => d.Kunnr === dealerId);
    if (dealer) setSelectedDealer(dealer);
  };

  const { pending, completed } = useMemo(() => {
    const pending: Dealer[] = [];
    const completed: Dealer[] = [];
    for (const d of dealers) (d.BeatFreq === "Y" ? completed : pending).push(d);
    return { pending, completed };
  }, [dealers]);

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

  if (isLoading || isFetching) {
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

  return (
    <MainLayout>
      <DataTabs
        tabs={[
          {
            label: "Pending",
            value: "pending",
            count: pending.length || 0,
          },
          {
            label: "Completed",
            value: "completed",
            count: completed.length || 0,
          },
        ]}
        activeTab={selectedTab}
        setActiveTab={setSelectedTab}
      />

      <DealerList
        dealers={selectedTab === "pending" ? pending : completed}
        onDealerSelect={handleDealerSelect}
        onRefresh={refetch}
      />
    </MainLayout>
  );
}
