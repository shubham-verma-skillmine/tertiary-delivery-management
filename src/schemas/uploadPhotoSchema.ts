import z from "zod";

export const UploadPhotoSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  preview: z.string(),
});

export type UploadedPhoto = z.infer<typeof UploadPhotoSchema>;
