import { createContext } from "react";
import type { TripDetailContextValue } from "@/schemas/tripDetailContextSchema";

export const TripDetailContext = createContext<TripDetailContextValue | null>(
  null,
);
