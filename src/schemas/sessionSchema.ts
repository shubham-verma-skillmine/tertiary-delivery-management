import z from "zod";

export const SessionRequestPayloadSchema = z.object({
  tripId: z.string(),
  dealerCode: z.string(),
});

export type SessionRequestPayload = z.infer<typeof SessionRequestPayloadSchema>;

export const SessionResponseSchema = z.object({
  tripId: z.string(),
  dealerCode: z.string(),
});

export type SessionResponse = z.infer<typeof SessionResponseSchema>;
