import { useCallback, useEffect, useRef, useState } from "react";

type QueryStatus = "idle" | "loading" | "success" | "error";

export type UseAppQueryOptions<TData> = {
  queryFn: () => Promise<TData>;
  enabled?: boolean;
  onSuccess?: (data: TData) => void;
  onError?: (error: unknown) => void;
  onSettled?: (data: TData | undefined, error: unknown) => void;
};

type UseAppQueryReturn<TData> = {
  data: TData | undefined;
  error: unknown;
  status: QueryStatus;
  isIdle: boolean;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  refetch: () => Promise<void>;
};

export const useAppQuery = <TData>({
  queryFn,
  enabled = false,
  onSuccess,
  onError,
  onSettled,
}: UseAppQueryOptions<TData>): UseAppQueryReturn<TData> => {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [error, setError] = useState<unknown>(undefined);
  const [status, setStatus] = useState<QueryStatus>("idle");
  const [isFetching, setIsFetching] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const queryFnRef = useRef(queryFn);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);
  const onSettledRef = useRef(onSettled);

  useEffect(() => {
    queryFnRef.current = queryFn;
  }, [queryFn]);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);
  useEffect(() => {
    onSettledRef.current = onSettled;
  }, [onSettled]);

  const fetchData = useCallback(async (): Promise<void> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsFetching(true);
    setStatus((prev) =>
      prev === "idle" || prev === "error" ? "loading" : prev,
    );

    try {
      const response = await queryFnRef.current();

      if (controller.signal.aborted) return;

      setData(response);
      setError(undefined);
      setStatus("success");
      onSuccess?.(response);
      onSuccessRef.current?.(response);
      onSettledRef.current?.(response, undefined);
    } catch (err) {
      console.log("Error: ", err);
      if (controller.signal.aborted) return;

      setError(err);
      setStatus("error");

      if (onErrorRef.current) {
        onErrorRef.current(err);
      } else {
        throw err;
      }
      onSettledRef.current?.(undefined, err);
    } finally {
      if (!controller.signal.aborted) {
        setIsFetching(false);
      }
    }
  }, []);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!enabled) return;
    fetchData();
    return () => abortControllerRef.current?.abort();
  }, [enabled, fetchData]);

  return {
    data,
    error,
    status,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isFetching,
    isSuccess: status === "success",
    isError: status === "error",
    refetch,
  };
};
