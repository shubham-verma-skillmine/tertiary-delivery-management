import { AppError } from "@/utils/AppError";

const BASE_URL = "https://tms.jktyre.co.in/api/v1/";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  enableResponseParsing?: boolean;
};

type RequestConfig<TBody = unknown> = RequestOptions & {
  method: RequestMethod;
  body?: TBody;
};

type ResponseType = "json" | "blob" | "text" | "arrayBuffer" | "none";

const extractErrorMessage = (data: unknown): string | undefined => {
  if (data && typeof data === "object" && "message" in data) {
    const { message } = data as { message: unknown };
    if (typeof message === "string") return message;
  }
  return undefined;
};

const resolveResponseType = (contentType: string): ResponseType => {
  if (contentType.includes("application/json")) return "json";
  if (
    contentType.includes("application/pdf") ||
    contentType.includes("image/") ||
    contentType.includes("video/") ||
    contentType.includes("audio/") ||
    contentType.includes("application/octet-stream")
  )
    return "blob";
  if (contentType.includes("text/")) return "text";
  return "none";
};

const parseResponse = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("Content-Type") ?? "";
  const responseType = resolveResponseType(contentType);

  switch (responseType) {
    case "json":
      return response.json();
    case "blob":
      return response.blob();
    case "text":
      return response.text();
    case "arrayBuffer":
      return response.arrayBuffer();
    case "none":
      return null;
  }
};

const request = async <TResponse>(
  url: string,
  config: RequestConfig,
): Promise<TResponse> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...config.headers,
  };

  const fetchConfig: RequestInit = {
    method: config.method,
    headers,
    signal: config.signal,
  };

  if (
    config.body !== undefined &&
    headers["Content-Type"] === "application/json"
  ) {
    fetchConfig.body = JSON.stringify(config.body);
  }

  let response: Response;

  try {
    response = await fetch(`${BASE_URL}${url}`, fetchConfig);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;

    throw new AppError({
      userMessage: "Network error. Please check your connection.",
      details: err,
    });
  }

  if (!response.ok) {
    let errorData: unknown = null;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text().catch(() => null);
    }
    throw new AppError({
      userMessage: extractErrorMessage(errorData) ?? "Something went wrong",
      statusCode: response.status,
      details: errorData,
    });
  }

  let data = await parseResponse(response);

  if (config.enableResponseParsing) {
    data = (data as Record<string, unknown>)?.data ?? data;
  }
  console.log("apiClient: ", data);
  return data as TResponse;
};

const buildUrl = (
  url: string,
  params?: Record<string, string | number | boolean>,
): string => {
  if (!params) return url;
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  ).toString();
  return `${url}?${query}`;
};

export const apiClient = {
  get: <TResponse>(
    url: string,
    params?: Record<string, string | number | boolean>,
    options?: RequestOptions,
  ) =>
    request<TResponse>(buildUrl(url, params), {
      ...options,
      method: "GET",
      enableResponseParsing: true,
    }),

  post: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ) =>
    request<TResponse>(url, {
      ...options,
      method: "POST",
      body,
      enableResponseParsing: true,
    }),

  put: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ) =>
    request<TResponse>(url, {
      ...options,
      method: "PUT",
      body,
      enableResponseParsing: true,
    }),

  patch: <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ) =>
    request<TResponse>(url, {
      ...options,
      method: "PATCH",
      body,
      enableResponseParsing: true,
    }),

  delete: <TResponse>(url: string, options?: RequestOptions) =>
    request<TResponse>(url, {
      ...options,
      method: "DELETE",
      enableResponseParsing: true,
    }),
};
