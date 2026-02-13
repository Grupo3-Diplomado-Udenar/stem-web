import { http } from "./http";

export interface University {
    id_universidad: number;
    nombre: string;
    estado?: string;
}

export interface Career {
    id_carrera: number;
    nombre: string;
    nivel: string;
    id_universidad: number;
    estado?: string;
}

function normalizeList<T>(payload: unknown, fallbackKey: "universities" | "careers") {
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

export const universitiesApi = {
    list: async () => {
        const payload = await http<unknown>("/universities");
        return normalizeList<University>(payload, "universities");
    },
    careersByUniversity: async (universityId: number) => {
        const payload = await http<unknown>(`/universities/${universityId}/careers`);
        return normalizeList<Career>(payload, "careers");
    },
};
