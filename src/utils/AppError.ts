export class AppError extends Error {
  statusCode?: number;
  userMessage: string;
  devMessage?: string;
  details?: unknown;

  constructor({
    userMessage,
    devMessage,
    statusCode,
    details,
  }: {
    userMessage: string;
    devMessage?: string;
    statusCode?: number;
    details?: unknown;
  }) {
    super(devMessage || userMessage);
    this.userMessage = userMessage;
    this.devMessage = devMessage;
    this.statusCode = statusCode;
    this.details = details;
  }

  static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}
