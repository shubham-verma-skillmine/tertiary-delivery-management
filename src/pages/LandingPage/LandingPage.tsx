import { useState } from "react";
import type { Dealer } from "@/schemas/dealerSchema";
import MainLayout from "@/layouts/MainLayout";
import DeliveryStatusStripe from "./components/DeliveryStatusStripe";
import DealerList from "./components/DealerList";
import DeliveryDetails from "./components/DeliveryDetails";
import dummyDealers from "../../mocks/dealers.json";

export default function LandingPage() {
  const [dealers] = useState<Dealer[]>(dummyDealers as Dealer[]);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);

  const handleDealerSelect = (dealerId: string) => {
    const dealer = dealers.find((d) => d.Kunnr === dealerId);
    if (dealer) setSelectedDealer(dealer);
  };

  // useEffect(() => {
  //   const fetchTripDetails = async () => {
  //     try {
  //       const tripId = window.location.pathname
  //         .split("/")
  //         .filter(Boolean)
  //         .pop();

  //       const response = await fetch(
  //         `http://localhost:8000/api/v1/t-mock/serviceprovider/trips/trip?tripId=${tripId}`,
  //       );

  //       // Handle HTTP errors
  //       if (!response.ok) {
  //         let errorMessage = `HTTP ${response.status} - ${response.statusText}`;

  //         try {
  //           const errorData = await response.json();
  //           errorMessage = errorData?.message || errorMessage;
  //         } catch {
  //           // response is not JSON
  //         }

  //         throw new Error(errorMessage);
  //       }

  //       const result = await response.json();
  //       setDealers(result.data);
  //     } catch (err) {
  //       // Handle network errors separately
  //       if (err instanceof TypeError) {
  //         alert("Network error or CORS issue");
  //       } else {
  //         alert(err.message || "Error fetching trip details");
  //       }

  //       console.error("Error fetching trip details:", err);
  //     }
  //   };

  //   fetchTripDetails();
  // }, []);

  if (selectedDealer) {
    return (
      <DeliveryDetails
        dealer={selectedDealer}
        openHomePage={() => setSelectedDealer(null)}
      />
    );
  }

  return (
    <MainLayout>
      <DeliveryStatusStripe
        totalDeliveries={dealers.length}
        delivered={dealers.filter((d) => d.Status === "delivered").length}
        distanceCovered={0}
      />
      <DealerList dealers={dealers} onDealerSelect={handleDealerSelect} />
    </MainLayout>
  );
}
