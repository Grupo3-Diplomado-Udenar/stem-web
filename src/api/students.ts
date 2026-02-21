import { http } from "./http";

export interface Student {
    numero_identificacion: string;
    tipo_identificacion: string;
    nombres: string;
    apellidos: string;
    email: string;
    celular: string;
    ciudad: string;
    estado: boolean;
    fecha_registro: Date;
}

export type CreateStudentDto = Omit<Student, "fecha_registro">;
export type UpdateStudentDto = Partial<CreateStudentDto>;

export type StudentCareerStatus =
    | "ACTIVO"
    | "GRADUADO"
    | "RETIRADO"
    | "SUSPENDIDO"
    | "EN_PAUSA";

export interface AssignCareerDto {
    id_carrera: number;
    estado: StudentCareerStatus;
    semestre_actual: number;
    fecha_inicio: string;
    fecha_fin?: string;
}

export interface UpdateStudentCareerDto {
    estado?: StudentCareerStatus;
    semestre_actual?: number;
    fecha_inicio?: string;
    fecha_fin?: string | null;
}

export interface StudentCareerRecord {
    id_carrera?: number;
    estado?: StudentCareerStatus | string;
    semestre_actual?: number;
    fecha_inicio?: string;
    fecha_fin?: string | null;
    carrera?: {
        id_carrera?: number;
        nombre?: string;
        nivel?: string;
        id_universidad?: number;
        universidad?: {
            id_universidad?: number;
            nombre?: string;
        };
    };
    universidad?: {
        id_universidad?: number;
        nombre?: string;
    };
}

function normalizeList<T>(payload: unknown, fallbackKey: "careers") {
    if (Array.isArray(payload)) {
        return payload as T[];
    }
    if (payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;
        const nested = record.data ?? record[fallbackKey];
        if (Array.isArray(nested)) {
            return nested as T[];
        }
    }
    return [] as T[];
}

export const studentsApi = {
    list: () => http<Student[]>("/students"),
    get: (numero_identificacion: string) => http<Student>(`/students/${numero_identificacion}`),
    create: (dto: CreateStudentDto) =>
        http<Student>("/students", { method: "POST", body: JSON.stringify(dto) }),
    update: (numero_identificacion: string, dto: UpdateStudentDto) =>
        http<Student>(`/students/${numero_identificacion}`, {
            method: "PATCH", body: JSON.stringify(dto)
        }),
    assignCareer: (numero_identificacion: string, dto: AssignCareerDto) =>
        http<void>(`/students/${numero_identificacion}/careers`, {
            method: "POST",
            body: JSON.stringify(dto),
        }),
    listCareers: async (numero_identificacion: string) => {
        const payload = await http<unknown>(`/students/${numero_identificacion}/careers`);
        return normalizeList<StudentCareerRecord>(payload, "careers");
    },
    updateCareer: (numero_identificacion: string, careerId: number, dto: UpdateStudentCareerDto) =>
        http<void>(`/students/${numero_identificacion}/careers/${careerId}`, {
            method: "PATCH",
            body: JSON.stringify(dto),
        }),
    removeCareer: (numero_identificacion: string, careerId: number) =>
        http<void>(`/students/${numero_identificacion}/careers/${careerId}`, { method: "DELETE" }),
    remove: (numero_identificacion: string) =>
        http<void>(`/students/${numero_identificacion}`, { method: "DELETE" }),
};