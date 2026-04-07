import z from "zod";
import { DealersListSchema } from "./dealerSchema";

export const TripSchema = z.object({
  id: z.string(),
  name: z.string(),
  dealers: DealersListSchema,
});

export type Trip = z.infer<typeof TripSchema>;

export const TripsListSchema = z.array(TripSchema);

export type TripsList = z.infer<typeof TripsListSchema>;
