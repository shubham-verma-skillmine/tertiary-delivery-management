import type { ReactNode } from "react";
import { TripDetailContext } from "./TripDetailContext";

export const TripDetailContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const getTripIdFromURL = () => {
    const { pathname } = window.location;
    const segments = pathname.split("/").filter(Boolean);
    return segments[segments.length - 1];
  };

  return (
    <TripDetailContext.Provider value={{ tripId: getTripIdFromURL() }}>
      {children}
    </TripDetailContext.Provider>
  );
};
