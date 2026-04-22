import z from "zod";

export const DocumentDownloadRequestPayloadSchema = z.object({
  documentName: z.string(),
});

export type DocumentDownloadRequestPayload = z.infer<
  typeof DocumentDownloadRequestPayloadSchema
>;

export const DocumentDownloadResponseSchema = z.object({
  presignedUrl: z.string(),
});

export type DocumentDownloadResponse = z.infer<
  typeof DocumentDownloadResponseSchema
>;
