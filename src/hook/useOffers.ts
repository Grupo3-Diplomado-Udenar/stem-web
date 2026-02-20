import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { offersApi } from "../api/offers";
import type { OfferRecord } from "../api/offers";

const OFFERS_QUERY_KEY = ["offers"];

export function useOffersListQuery() {
    return useQuery({
        queryKey: OFFERS_QUERY_KEY,
        queryFn: offersApi.list,
        staleTime: 60_000,
    });
}

export function useOrganizationOffersQuery(orgId?: string) {
    return useQuery({
        queryKey: [...OFFERS_QUERY_KEY, "organization", orgId],
        queryFn: () => offersApi.listByOrganization(orgId ?? ""),
        enabled: Boolean(orgId),
        staleTime: 60_000,
    });
}

export function useCreateOfferMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: Partial<OfferRecord>) => offersApi.create(dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
            if (variables.id_organizacion) {
                queryClient.invalidateQueries({
                    queryKey: [...OFFERS_QUERY_KEY, "organization", variables.id_organizacion]
                });
            }
        },
    });
}

export function useUpdateOfferMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: Partial<OfferRecord> }) =>
            offersApi.update(id, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
            if (variables.dto.id_organizacion) {
                queryClient.invalidateQueries({
                    queryKey: [...OFFERS_QUERY_KEY, "organization", variables.dto.id_organizacion]
                });
            }
        },
    });
}

export function useDeleteOfferMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, orgId }: { id: number; orgId?: string }) => offersApi.remove(id),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: OFFERS_QUERY_KEY });
            if (variables.orgId) {
                queryClient.invalidateQueries({
                    queryKey: [...OFFERS_QUERY_KEY, "organization", variables.orgId]
                });
            }
        },
    });
}
