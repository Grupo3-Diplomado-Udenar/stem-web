import { http } from "./http";

export interface OfferRecord {
    id_oferta: number;
    titulo: string;
    descripcion: string;
    requisitos: string;
    tipo_contrato: string;
    ubicacion: string;
    salario: string;
    fecha_publicacion: string;
    fecha_cierre: string;
    estado: string | null;
    id_organizacion: string;
}

function normalizeList<T>(payload: unknown, fallbackKey: "offers") {
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

export const offersApi = {
    list: async () => {
        const payload = await http<unknown>("/offers");
        return normalizeList<OfferRecord>(payload, "offers");
    },
};
