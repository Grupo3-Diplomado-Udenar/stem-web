import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "../api/students";
import type { CreateStudentDto, UpdateStudentDto } from "../api/students";

const STUDENTS_QUERY_KEY = ["students"];

export function useStudentsListQuery() {
    return useQuery({
        queryKey: STUDENTS_QUERY_KEY,
        queryFn: studentsApi.list,
        staleTime: 60_000,
    });
}

export function useStudentQuery(studentId?: string) {
    return useQuery({
        queryKey: [...STUDENTS_QUERY_KEY, studentId],
        queryFn: () => studentsApi.get(studentId ?? ""),
        enabled: Boolean(studentId),
        staleTime: 60_000,
    });
}

export function useCreateStudentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateStudentDto) => studentsApi.create(dto),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
        },
    });
}

export function useUpdateStudentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentId, dto }: { studentId: string; dto: UpdateStudentDto }) =>
            studentsApi.update(studentId, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...STUDENTS_QUERY_KEY, variables.studentId] });
        },
    });
}

export function useDeleteStudentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentId: string) => studentsApi.remove(studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
        },
    });
}
