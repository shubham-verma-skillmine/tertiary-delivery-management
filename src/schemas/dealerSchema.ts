import z from "zod";

export const DealerSchema = z.object({
  TripId: z.string(),
  Kunnr: z.string(),
  CustName: z.string(),
  RouteCd: z.string(),
  RouteName: z.string(),
});

export type Dealer = z.infer<typeof DealerSchema>;

export const DealersListSchema = z.array(DealerSchema);

export type DealersList = z.infer<typeof DealersListSchema>;
