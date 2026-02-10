import { http } from "./http";

export class Student {
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

export const studentsApi = {
    list: () => http<Student[]>("/students"),
    get: (numero_identificacion: string) => http<Student>(`/students/${numero_identificacion}`),
    create: (dto: CreateStudentDto) =>
        http<Student>("/students", { method: "POST", body: JSON.stringify(dto) }),
    update: (numero_identificacion: string, dto: UpdateStudentDto) =>
        http<Student>(`/students/${numero_identificacion}`, {
            method: "PATCH", body: JSON.stringify(dto)
        }),
    remove: (numero_identificacion: string) =>
        http<void>(`/students/${numero_identificacion}`, { method: "DELETE" }),
};