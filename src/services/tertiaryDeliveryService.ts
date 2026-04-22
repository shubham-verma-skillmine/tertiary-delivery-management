import { apiClient } from "@/api/apiClient";
import { DealersListSchema } from "@/schemas/dealerSchema";
import { DocumentDownloadResponseSchema } from "@/schemas/documentDownloadSchema";
import { DocumentUploadResponseSchema } from "@/schemas/documentUploadSchema";
import { MarkDeliveryCompleteResponseSchema } from "@/schemas/markDeliveryCompleteSchema";
import { SessionResponseSchema } from "@/schemas/sessionSchema";
import { withService } from "@/utils/serviceWrapper";

export const getDealersInTrip = withService(
  ({ tripId }) =>
    apiClient.get("tertiary/public/serviceprovider/trips/trip", { tripId }),
  DealersListSchema,
);

export const startSession = withService(
  (payload) =>
    apiClient.post(
      "tertiary/public/serviceprovider/trips/trip/dealer/delivery-sessions",
      payload,
    ),
  SessionResponseSchema,
);

export const generateDocumentUploadPresignedUrl = withService(
  (payload) =>
    apiClient.post(
      "tertiary/public/serviceprovider/trips/trip/dealer/documents/upload-url",
      payload,
    ),
  DocumentUploadResponseSchema,
);

export const uploadDocumentToPresignedUrl = async ({
  apiUrl,
  binaryImage,
  contentType,
}: {
  apiUrl: string;
  binaryImage: BodyInit | null | undefined;
  contentType: string;
}) => {
  await fetch(apiUrl, {
    method: "PUT",
    body: binaryImage,
    headers: {
      "Content-Type": contentType,
    },
  });
};

export const generateDocumentDownloadPresignedUrl = withService(
  (payload) =>
    apiClient.post(
      "tertiary/public/serviceprovider/trips/trip/dealer/documents/download-url",
      payload,
    ),
  DocumentDownloadResponseSchema,
);

export const markDeliveryComplete = withService(
  (payload) =>
    apiClient.post(
      "tertiary/public/serviceprovider/trips/trip/dealer/deliveries/complete",
      payload,
    ),
  MarkDeliveryCompleteResponseSchema,
);
