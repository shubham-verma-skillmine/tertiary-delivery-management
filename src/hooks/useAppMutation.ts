import { useState } from "react";

type MutationStatus = "idle" | "pending" | "success" | "error";

export type UseAppMutationOptions<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: unknown, variables: TVariables) => void;
  onSettled?: (
    data: TData | undefined,
    error: unknown,
    variables: TVariables,
  ) => void;
};

type UseAppMutationReturn<TData, TVariables> = {
  data: TData | undefined;
  error: unknown;
  status: MutationStatus;
  isIdle: boolean;
  isPending: boolean;
  isSuccess: boolean;
  isError: boolean;
  mutate: (variables: TVariables) => Promise<void>;
  reset: () => void;
};

export const useAppMutation = <TData, TVariables>({
  mutationFn,
  onSuccess,
  onError,
  onSettled,
}: UseAppMutationOptions<TData, TVariables>): UseAppMutationReturn<
  TData,
  TVariables
> => {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<unknown>(undefined);
  const [status, setStatus] = useState<MutationStatus>("idle");

  const mutate = async (variables: TVariables): Promise<void> => {
    setData(undefined);
    setError(undefined);
    setStatus("pending");
    try {
      const response = await mutationFn(variables);
      setData(response);
      setStatus("success");
      onSuccess?.(response, variables);
      onSettled?.(response, undefined, variables);
    } catch (err) {
      setError(err);
      setStatus("error");

      if (onError) {
        onError(err, variables);
      } else {
        throw err;
      }
      onSettled?.(undefined, err, variables);
    }
  };

  const reset = () => {
    setData(undefined);
    setError(undefined);
    setStatus("idle");
  };

  return {
    data,
    error,
    status,
    isIdle: status === "idle",
    isPending: status === "pending",
    isSuccess: status === "success",
    isError: status === "error",
    mutate,
    reset,
  };
};
