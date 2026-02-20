import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications";

const APPLICATIONS_QUERY_KEY = ["applications"];

export function useOrganizationApplicantsQuery(orgId?: string) {
    return useQuery({
        queryKey: [...APPLICATIONS_QUERY_KEY, "organization", orgId],
        queryFn: () => applicationsApi.listByOrganization(orgId ?? ""),
        enabled: Boolean(orgId),
        staleTime: 60_000,
    });
}
