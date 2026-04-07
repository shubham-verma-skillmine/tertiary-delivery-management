import z from "zod";

export const DealerSchema = z.object({
  TripId: z.string(),
  Kunnr: z.string(),
  CustName: z.string(),
  Status: z.enum(["pending", "delivered"]),
});

export type Dealer = z.infer<typeof DealerSchema>;

export const DealersListSchema = z.array(DealerSchema);

export type DealersList = z.infer<typeof DealersListSchema>;
