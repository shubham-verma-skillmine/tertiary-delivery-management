import {
  useAppMutation,
  type UseAppMutationOptions,
} from "@/hooks/useAppMutation";
import type {
  DocumentDownloadRequestPayload,
  DocumentDownloadResponse,
} from "@/schemas/documentDownloadSchema";
import type {
  DocumentUploadRequestPayload,
  DocumentUploadResponse,
} from "@/schemas/documentUploadSchema";
import type {
  MarkDeliveryCompleteRequestPayload,
  MarkDeliveryCompleteResponse,
} from "@/schemas/markDeliveryCompleteSchema";
import type {
  SessionRequestPayload,
  SessionResponse,
} from "@/schemas/sessionSchema";
import {
  generateDocumentDownloadPresignedUrl,
  generateDocumentUploadPresignedUrl,
  markDeliveryComplete,
  startSession,
  uploadDocumentToPresignedUrl,
} from "@/services/tertiaryDeliveryService";

export const useStartSessionMutation = (
  options?: Partial<
    UseAppMutationOptions<SessionResponse, SessionRequestPayload>
  >,
) => {
  return useAppMutation<SessionResponse, SessionRequestPayload>({
    mutationFn: startSession,
    ...options,
  });
};

export const useDocumentUploadPresignedUrlMutation = (
  options?: Partial<
    UseAppMutationOptions<DocumentUploadResponse, DocumentUploadRequestPayload>
  >,
) => {
  return useAppMutation<DocumentUploadResponse, DocumentUploadRequestPayload>({
    mutationFn: generateDocumentUploadPresignedUrl,
    ...options,
  });
};

export const useDocumentDownloadPresignedUrlMutation = (
  options?: Partial<
    UseAppMutationOptions<
      DocumentDownloadResponse,
      DocumentDownloadRequestPayload
    >
  >,
) => {
  return useAppMutation<
    DocumentDownloadResponse,
    DocumentDownloadRequestPayload
  >({
    mutationFn: generateDocumentDownloadPresignedUrl,
    ...options,
  });
};

export const useUploadDocumentToPresignedUrlMutation = (
  options?: Partial<UseAppMutationOptions<unknown, unknown>>,
) => {
  return useAppMutation({
    mutationFn: uploadDocumentToPresignedUrl,
    ...options,
  });
};

export const useMarkDeliveryCompleteMutation = (
  options?: Partial<
    UseAppMutationOptions<
      MarkDeliveryCompleteResponse,
      MarkDeliveryCompleteRequestPayload
    >
  >,
) => {
  return useAppMutation({
    mutationFn: markDeliveryComplete,
    ...options,
  });
};
