import { useAppQuery, type UseAppQueryOptions } from "@/hooks/useAppQuery";
import { getDealersInTrip } from "@/services/tertiaryDeliveryService";
import type { DealersList } from "@/schemas/dealerSchema";

export const useDealerQuery = (
  options: Partial<UseAppQueryOptions<DealersList>> & {
    tripId: string;
  },
) => {
  const { tripId, ...queryOverrides } = options ?? {};
  return useAppQuery<DealersList>({
    queryFn: () => getDealersInTrip({ tripId }),
    enabled: !!tripId,
    ...queryOverrides,
  });
};
