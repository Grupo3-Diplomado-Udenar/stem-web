import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "../api/students";
import type {
    AssignCareerDto,
    CreateStudentDto,
    UpdateStudentCareerDto,
    UpdateStudentDto,
} from "../api/students";

const STUDENTS_QUERY_KEY = ["students"];
const STUDENT_CAREERS_QUERY_KEY = ["students", "careers"];

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

export function useAssignCareerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentId, dto }: { studentId: string; dto: AssignCareerDto }) =>
            studentsApi.assignCareer(studentId, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
            queryClient.invalidateQueries({ queryKey: [...STUDENTS_QUERY_KEY, variables.studentId] });
            queryClient.invalidateQueries({ queryKey: [...STUDENT_CAREERS_QUERY_KEY, variables.studentId] });
        },
    });
}

export function useUpdateStudentCareerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            studentId,
            careerId,
            dto,
        }: {
            studentId: string;
            careerId: number;
            dto: UpdateStudentCareerDto;
        }) => studentsApi.updateCareer(studentId, careerId, dto),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [...STUDENT_CAREERS_QUERY_KEY, variables.studentId] });
        },
    });
}

export function useRemoveStudentCareerMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ studentId, careerId }: { studentId: string; careerId: number }) =>
            studentsApi.removeCareer(studentId, careerId),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: [...STUDENT_CAREERS_QUERY_KEY, variables.studentId] });
        },
    });
}

export function useStudentCareersQuery(studentId?: string) {
    return useQuery({
        queryKey: [...STUDENT_CAREERS_QUERY_KEY, studentId],
        queryFn: () => studentsApi.listCareers(studentId ?? ""),
        enabled: Boolean(studentId),
        staleTime: 60_000,
    });
}
