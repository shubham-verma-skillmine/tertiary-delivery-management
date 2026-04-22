import z from "zod";

export const MarkDeliveryCompleteRequestPayloadSchema = z.object({
  documents: z.array(z.string()),
  tripId: z.string(),
  dealerCode: z.string(),
});

export type MarkDeliveryCompleteRequestPayload = z.infer<
  typeof MarkDeliveryCompleteRequestPayloadSchema
>;

export const MarkDeliveryCompleteResponseSchema = z.object({
  tripId: z.string(),
  dealerCode: z.string(),
  submissionSource: z.string(),
  attachments: z.array(z.object({ documentName: z.string() })),
});

export type MarkDeliveryCompleteResponse = z.infer<
  typeof MarkDeliveryCompleteResponseSchema
>;
