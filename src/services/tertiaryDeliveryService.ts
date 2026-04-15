import { apiClient } from "@/api/apiClient";
import { DealersListSchema } from "@/schemas/dealerSchema";
import { withService } from "@/utils/serviceWrapper";

export const getDealersInTrip = withService(
  ({ tripId }) =>
    apiClient.get("tertiary/public/serviceprovider/trips/trip", { tripId }),
  DealersListSchema,
);
