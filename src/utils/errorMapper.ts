import { ZodError } from "zod";
import { AppError } from "./AppError";

export const mapError = (err: unknown): AppError => {
  if (err instanceof ZodError) {
    return new AppError({
      userMessage: "Received unexpected data format. Please contact support.",
      devMessage: err.message,
      details: err.issues,
    });
  }

  if (err instanceof AppError) {
    return err;
  }

  return new AppError({
    userMessage: "Unknown error occurred.",
    devMessage: String(err),
  });
};
