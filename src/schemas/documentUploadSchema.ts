import z from "zod";

export const DocumentUploadRequestPayloadSchema = z.object({
  tripId: z.string(),
  dealerCode: z.string(),
  documentId: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  contentType: z.string(),
});

export type DocumentUploadRequestPayload = z.infer<
  typeof DocumentUploadRequestPayloadSchema
>;

export const DocumentUploadResponseSchema = z.object({
  presignedUrl: z.string(),
  documentName: z.string(),
});

export type DocumentUploadResponse = z.infer<
  typeof DocumentUploadResponseSchema
>;
