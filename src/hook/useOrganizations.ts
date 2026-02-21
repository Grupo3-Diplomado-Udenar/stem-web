import { useQuery } from "@tanstack/react-query";
import { organizationsApi } from "../api/organizations";

const ORGANIZATIONS_QUERY_KEY = ["organizations"];

export function useFeaturedOrganizationsQuery() {
    return useQuery({
        queryKey: [...ORGANIZATIONS_QUERY_KEY, "featured"],
        queryFn: organizationsApi.listFeatured,
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
    });
}
