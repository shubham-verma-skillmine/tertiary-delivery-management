import z from "zod";

export const UploadPhotoSchema = z.object({
  documentId: z.string(),
  documentName: z.string(),
  documentUrl: z.string(),
});

export type UploadedPhoto = z.infer<typeof UploadPhotoSchema>;
