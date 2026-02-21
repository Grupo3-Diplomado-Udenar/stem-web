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

export interface FeaturedOrganization {
    id_organizacion: string;
    nombre: string;
    sector: string | null;
    logo_url: string | null;
    ubicacion: string | null;
    descripcion: string | null;
    total_postulaciones: number;
    vacantes_activas: number;
}

export const organizationsApi = {
    get: (id: string) => http<OrganizationRecord>(`/organizations/${id}`),
    update: (id: string, dto: Partial<OrganizationRecord>) => {
        return http<OrganizationRecord>(`/organizations/${id}`, {
            method: "PUT",
            body: JSON.stringify(dto),
            headers: { "Content-Type": "application/json" },
        });
    },
    listFeatured: async (): Promise<FeaturedOrganization[]> => {
        const payload = await http<FeaturedOrganization[]>("/organizations/featured");
        return Array.isArray(payload) ? payload : [];
    },
};
