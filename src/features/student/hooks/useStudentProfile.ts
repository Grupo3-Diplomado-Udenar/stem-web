import { useState, useEffect } from "react";
import { useProfileQuery } from "../../../hook/useProfile";
import {
    useAssignCareerMutation,
    useRemoveStudentCareerMutation,
    useStudentCareersQuery,
    useStudentQuery,
    useUpdateStudentCareerMutation,
    useUpdateStudentMutation,
} from "../../../hook/useStudents";
import { universitiesApi } from "../../../api/universities";
import type { Career, University } from "../../../api/universities";
import type { StudentProfile, EducationEntry } from "../types/student.types";
import { createEmptyEntry } from "../utils/student.constants";

export const useStudentProfile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<StudentProfile>>({});
    const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([]);
    const [educationError, setEducationError] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [universities, setUniversities] = useState<University[]>([]);
    const [careersByUniversity, setCareersByUniversity] = useState<Record<number, Career[]>>({});
    const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
    const [loadingCareersByUniversity, setLoadingCareersByUniversity] = useState<Record<number, boolean>>({});

    const profileQuery = useProfileQuery(true);
    const profile = profileQuery.data as StudentProfile | undefined;
    const profileErrorMessage = profileQuery.error instanceof Error
        ? profileQuery.error.message
        : "No pudimos cargar el perfil.";

    const studentId = profile?.numero_identificacion;
    const studentQuery = useStudentQuery(studentId);
    const studentCareersQuery = useStudentCareersQuery(studentId);

    const updateStudentMutation = useUpdateStudentMutation();
    const assignCareerMutation = useAssignCareerMutation();
    const updateStudentCareerMutation = useUpdateStudentCareerMutation();
    const removeStudentCareerMutation = useRemoveStudentCareerMutation();

    const student = studentQuery.data as StudentProfile | undefined;
    const studentErrorMessage = studentQuery.error instanceof Error
        ? studentQuery.error.message
        : "No pudimos cargar tu informacion.";

    const loadCareersForUniversity = (universityId: number) => {
        if (!universityId) return;
        if (careersByUniversity[universityId]) return;
        if (loadingCareersByUniversity[universityId]) return;
        setLoadingCareersByUniversity(prev => ({ ...prev, [universityId]: true }));
        setEducationError(null);
        universitiesApi
            .careersByUniversity(universityId)
            .then((data) => {
                setCareersByUniversity(prev => ({ ...prev, [universityId]: data ?? [] }));
            })
            .catch((error: unknown) => {
                setEducationError(error instanceof Error ? error.message : "No pudimos cargar carreras.");
            })
            .finally(() => {
                setLoadingCareersByUniversity(prev => ({ ...prev, [universityId]: false }));
            });
    };

    useEffect(() => {
        let isActive = true;
        setIsLoadingUniversities(true);
        setEducationError(null);
        universitiesApi
            .list()
            .then((data) => {
                if (isActive) {
                    setUniversities(data ?? []);
                }
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setEducationError(error instanceof Error ? error.message : "No pudimos cargar universidades.");
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoadingUniversities(false);
                }
            });
        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        if (!studentCareersQuery.data || isEditing) return;
        const entries = studentCareersQuery.data.map((record, index) => {
            const career = record.carrera;
            const university = career?.universidad ?? record.universidad;
            const universityId = career?.id_universidad ?? university?.id_universidad;
            const careerId = record.id_carrera ?? career?.id_carrera;
            if (universityId) {
                loadCareersForUniversity(universityId);
            }
            return {
                id: `${careerId ?? "career"}-${index}`,
                universityId: universityId ? String(universityId) : "",
                universityName: university?.nombre,
                careerId: careerId ? String(careerId) : "",
                careerName: career?.nombre,
                level: career?.nivel ?? "",
                status: record.estado ?? "",
                semester: record.semestre_actual ? String(record.semestre_actual) : "",
                startDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                endDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
                persisted: true,
                originalCareerId: careerId ? String(careerId) : "",
                originalStatus: record.estado ?? "",
                originalSemester: record.semestre_actual ? String(record.semestre_actual) : "",
                originalStartDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                originalEndDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
            };
        });
        setEducationEntries(entries.length > 0 ? entries : []);
    }, [studentCareersQuery.data, isEditing]);

    const handleEditClick = () => {
        if (student) {
            setEditData({
                nombres: student.nombres,
                apellidos: student.apellidos,
                celular: student.celular,
                ciudad: student.ciudad,
                email: student.email,
            });
        }
        if (studentCareersQuery.data && studentCareersQuery.data.length > 0) {
            const entries = studentCareersQuery.data.map((record, index) => {
                const career = record.carrera;
                const university = career?.universidad ?? record.universidad;
                const universityId = career?.id_universidad ?? university?.id_universidad;
                const careerId = record.id_carrera ?? career?.id_carrera;
                return {
                    id: `${careerId ?? "career"}-${index}`,
                    universityId: universityId ? String(universityId) : "",
                    universityName: university?.nombre,
                    careerId: careerId ? String(careerId) : "",
                    careerName: career?.nombre,
                    level: career?.nivel ?? "",
                    status: record.estado ?? "",
                    semester: record.semestre_actual ? String(record.semestre_actual) : "",
                    startDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                    endDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
                    persisted: true,
                    originalCareerId: careerId ? String(careerId) : "",
                    originalStatus: record.estado ?? "",
                    originalSemester: record.semestre_actual ? String(record.semestre_actual) : "",
                    originalStartDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                    originalEndDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
                };
            });
            setEducationEntries(entries);
        } else {
            setEducationEntries([createEmptyEntry()]);
        }
        setIsEditing(true);
        setSaveMessage(null);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEducationChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEducationEntries(prev =>
            prev.map((entry, entryIndex) => {
                if (entryIndex !== index) return entry;
                const next = { ...entry, [name]: value } as EducationEntry;
                if (name === "universityId") {
                    next.careerId = "";
                    const universityId = Number(value);
                    if (!Number.isNaN(universityId)) {
                        loadCareersForUniversity(universityId);
                    }
                }
                if (name === "level") {
                    next.careerId = "";
                }
                return next;
            })
        );
    };

    const addEducationEntry = () => {
        setEducationEntries(prev => [...prev, createEmptyEntry()]);
    };

    const removeEducationEntry = (entryId: string) => {
        setEducationEntries(prev => {
            const next = prev.filter((entry) => entry.id !== entryId);
            return next.length > 0 ? next : [createEmptyEntry()];
        });
    };

    const handleRemoveCareer = async (entry: EducationEntry) => {
        if (!studentId) return;
        if (!entry.persisted || !entry.originalCareerId) {
            removeEducationEntry(entry.id);
            return;
        }
        const careerId = Number(entry.originalCareerId);
        if (Number.isNaN(careerId)) {
            removeEducationEntry(entry.id);
            return;
        }
        try {
            await removeStudentCareerMutation.mutateAsync({ studentId, careerId });
            removeEducationEntry(entry.id);
        } catch (error: unknown) {
            setEducationError(error instanceof Error ? error.message : "No pudimos eliminar la carrera.");
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSaveMessage(null);
    };

    const handleSaveProfile = async () => {
        if (!studentId) {
            setSaveMessage({ type: "error", text: "No encontramos tu identificacion." });
            return;
        }
        setEducationError(null);
        try {
            const existingCareerIds = new Set(
                (studentCareersQuery.data ?? [])
                    .map((record) => record.id_carrera ?? record.carrera?.id_carrera)
                    .filter((id): id is number => typeof id === "number")
            );
            const plannedCareerIds = new Set<number>();
            const filledEntries = educationEntries.filter((entry) =>
                Boolean(
                    entry.universityId ||
                    entry.careerId ||
                    entry.level ||
                    entry.status ||
                    entry.semester ||
                    entry.startDate ||
                    entry.endDate
                )
            );
            for (let index = 0; index < filledEntries.length; index += 1) {
                const entry = filledEntries[index];
                if (!entry.universityId) {
                    setEducationError(`Selecciona una universidad en la carrera ${index + 1}.`);
                    return;
                }
                const careerId = entry.careerId ? Number(entry.careerId) : undefined;
                if (!careerId || Number.isNaN(careerId)) {
                    setEducationError(`Selecciona una carrera valida en la carrera ${index + 1}.`);
                    return;
                }
                if (!entry.careerId || !entry.startDate || !entry.status) {
                    setEducationError(`Completa carrera, estado y fecha de inicio en la carrera ${index + 1}.`);
                    return;
                }
                const semester = entry.semester ? Number(entry.semester) : undefined;
                if (semester !== undefined && Number.isNaN(semester)) {
                    setEducationError(`El semestre actual debe ser un numero en la carrera ${index + 1}.`);
                    return;
                }
                if (entry.persisted && entry.originalCareerId) {
                    const originalCareerId = Number(entry.originalCareerId);
                    if (careerId !== originalCareerId) {
                        if (existingCareerIds.has(careerId) || plannedCareerIds.has(careerId)) {
                            setEducationError(`La carrera ${index + 1} esta duplicada.`);
                            return;
                        }
                        plannedCareerIds.add(careerId);
                        await removeStudentCareerMutation.mutateAsync({
                            studentId,
                            careerId: originalCareerId,
                        });
                        await assignCareerMutation.mutateAsync({
                            studentId,
                            dto: {
                                id_carrera: careerId,
                                estado: entry.status as any,
                                semestre_actual: semester ?? 1,
                                fecha_inicio: entry.startDate,
                                fecha_fin: entry.endDate || undefined,
                            },
                        });
                    } else {
                        const hasChanges =
                            entry.status !== entry.originalStatus ||
                            entry.semester !== entry.originalSemester ||
                            entry.startDate !== entry.originalStartDate ||
                            entry.endDate !== entry.originalEndDate;
                        if (hasChanges) {
                            await updateStudentCareerMutation.mutateAsync({
                                studentId,
                                careerId: originalCareerId,
                                dto: {
                                    estado: entry.status as any,
                                    semestre_actual: semester ?? 1,
                                    fecha_inicio: entry.startDate,
                                    fecha_fin: entry.endDate || undefined,
                                },
                            });
                        }
                    }
                    continue;
                }
                if (existingCareerIds.has(careerId) || plannedCareerIds.has(careerId)) {
                    setEducationError(`La carrera ${index + 1} esta duplicada.`);
                    return;
                }
                plannedCareerIds.add(careerId);
                await assignCareerMutation.mutateAsync({
                    studentId,
                    dto: {
                        id_carrera: careerId,
                        estado: entry.status as any,
                        semestre_actual: semester ?? 1,
                        fecha_inicio: entry.startDate,
                        fecha_fin: entry.endDate || undefined,
                    },
                });
            }
            await updateStudentMutation.mutateAsync({ studentId, dto: editData });
            setIsEditing(false);
            setSaveMessage({ type: "success", text: "Perfil actualizado exitosamente" });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: unknown) {
            setSaveMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error al actualizar el perfil",
            });
        }
    };

    return {
        // State
        isEditing,
        editData,
        educationEntries,
        educationError,
        saveMessage,
        universities,
        careersByUniversity,
        isLoadingUniversities,
        loadingCareersByUniversity,

        // Data
        student,
        studentErrorMessage,
        profileQuery,
        studentQuery,

        // Mutations status
        isSaving: updateStudentMutation.isPending ||
            assignCareerMutation.isPending ||
            updateStudentCareerMutation.isPending ||
            removeStudentCareerMutation.isPending,

        // Handlers
        handleEditClick,
        handleEditInputChange,
        handleEducationChange,
        addEducationEntry,
        removeEducationEntry,
        handleRemoveCareer,
        handleCancel,
        handleSaveProfile,
        profileErrorMessage,
    };
};
