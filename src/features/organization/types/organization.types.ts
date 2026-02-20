export type OrgTabType = "vacantes" | "aplicantes" | "perfil";

export interface Oferta {
    titulo: string;
    descripcion: string;
    tipo: string;
    ubicacion: string;
    duracion: string;
    salario: string;
    habilidades: string[];
    fecha_cierre?: string;
}

export interface OrganizationProfile {
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
