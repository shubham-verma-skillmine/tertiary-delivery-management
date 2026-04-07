import { useContext } from "react";
import { TripDetailContext } from "./TripDetailContext";

export const useTripDetail = () => {
  const ctx = useContext(TripDetailContext);
  if (!ctx) {
    throw new Error(
      "useTripDetail must be used within a TripDetailContextProvider",
    );
  }
  return ctx;
};
