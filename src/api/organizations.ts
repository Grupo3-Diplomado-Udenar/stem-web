import { http } from "./http";

export interface OrganizationRecord {
    id_organizacion: string;
    nit: string;
    nombre: string;
    email: string;
    sector: string;
    descripcion: string;
    logo_url: string;
    ubicacion: string;
    estado: boolean;
}

export const organizationsApi = {
    get: (id: string) => http<OrganizationRecord>(`/organizations/${id}`),
};
