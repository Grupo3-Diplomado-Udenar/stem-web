import { getToken } from "./auth";
import { http } from "./http";

export interface CreateApplicationDto {
    id_num: string;
    id_oferta: number;
}

export interface ApplicationRecord {
    id_postulacion: number;
    fecha_postulacion: string;
    estado: string;
    id_num: string;
    id_oferta: number;
}

export const applicationsApi = {
    create: (dto: CreateApplicationDto) => {
        const token = getToken();
        return http<void>("/applications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify(dto),
        });
    },
    listByStudent: (studentId: string) => {
        const token = getToken();
        return http<ApplicationRecord[]>(`/applications/student/${studentId}`, {
            method: "GET",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
        });
    },
};
