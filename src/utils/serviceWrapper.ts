import { type ZodType, z } from "zod";
import { mapError } from "./errorMapper";

// Overload: with schema (no transform)
export function withService<Args extends unknown[], S extends ZodType>(
  fn: (...args: Args) => Promise<unknown>,
  schema: S,
): (...args: Args) => Promise<z.infer<S>>;

// Overload: with schema + transform
export function withService<Args extends unknown[], S extends ZodType, TOutput>(
  fn: (...args: Args) => Promise<unknown>,
  schema: S,
  transform: (data: z.infer<S>) => TOutput,
): (...args: Args) => Promise<TOutput>;

// Overload: without schema
export function withService<Args extends unknown[], R>(
  fn: (...args: Args) => Promise<R>,
): (...args: Args) => Promise<R>;

// Implementation
export function withService<
  Args extends unknown[],
  R,
  S extends ZodType | undefined = undefined,
  TOutput = S extends ZodType ? z.infer<NonNullable<S>> : R,
>(
  fn: (...args: Args) => Promise<R>,
  schema?: S,
  transform?: (data: unknown) => TOutput,
) {
  return async (...args: Args): Promise<TOutput> => {
    try {
      const result = await fn(...args);

      const validated = schema ? await schema.parseAsync(result) : result;

      if (transform) {
        return transform(validated);
      }

      return validated as TOutput;
    } catch (err) {
      throw mapError(err);
    }
  };
}
