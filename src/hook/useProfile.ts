import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../api/auth";
import type { ProfileData } from "../api/auth";

const PROFILE_QUERY_KEY = ["profile"];

export function useProfileQuery(enabled = true) {
    return useQuery({
        queryKey: PROFILE_QUERY_KEY,
        queryFn: getProfile,
        enabled,
        staleTime: 60_000,
    });
}

export function useUpdateProfileMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<ProfileData>) => updateProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
        },
    });
}
