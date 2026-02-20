import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications";
import type { UpdateApplicationStatusDto } from "../api/applications";

const APPLICATIONS_QUERY_KEY = ["applications"];

export function useOrganizationApplicantsQuery(orgId?: string) {
    return useQuery({
        queryKey: [...APPLICATIONS_QUERY_KEY, "organization", orgId],
        queryFn: () => applicationsApi.listByOrganization(orgId ?? ""),
        enabled: Boolean(orgId),
        staleTime: 60_000,
    });
}

export function useUpdateApplicationStatusMutation() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: UpdateApplicationStatusDto }) => 
            applicationsApi.updateStatus(id, dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: APPLICATIONS_QUERY_KEY });
        },
    });
}
