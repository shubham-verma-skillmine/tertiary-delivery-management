import z from "zod";

export const TripDetailContextValueSchema = z.object({
  tripId: z.string(),
});

export type TripDetailContextValue = z.infer<
  typeof TripDetailContextValueSchema
>;
