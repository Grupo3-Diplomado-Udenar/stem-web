import type { EducationEntry } from "../types/student.types";

export const educationLevels = [
    { value: "TECHNICAL", label: "Técnico" },
    { value: "TECHNOLOGICAL", label: "Tecnológico" },
    { value: "UNDERGRADUATE", label: "Pregrado" },
    { value: "SPECIALIZATION", label: "Especialización" },
    { value: "MASTERS", label: "Maestría" },
    { value: "DOCTORATE", label: "Doctorado" },
];

export const educationStatuses = [
    { value: "ACTIVO", label: "Activo" },
    { value: "GRADUADO", label: "Graduado" },
    { value: "RETIRADO", label: "Retirado" },
    { value: "SUSPENDIDO", label: "Suspendido" },
    { value: "EN_PAUSA", label: "En pausa" },
];

export const createEntryId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createEmptyEntry = (): EducationEntry => ({
    id: createEntryId(),
    universityId: "",
    careerId: "",
    level: "",
    status: "",
    semester: "",
    startDate: "",
    endDate: "",
    persisted: false,
});
