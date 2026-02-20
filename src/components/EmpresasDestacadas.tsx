import { useEffect, useState } from "react";
import { organizationsApi, type FeaturedOrganization } from "../api/organizations";

interface EmpresasDestacadasProps {
    onVerTodas?: () => void;
}

const SECTOR_ICONS: Record<string, string> = {
    "Technology": "💻",
    "Software": "💻",
    "Análisis de Datos": "📊",
    "Data": "📊",
    "IA & ML": "💡",
    "Cloud Computing": "☁️",
    "Biotecnología": "🧬",
    "Ciberseguridad": "🔒",
};

function getSectorIcon(sector: string | null): string {
    if (!sector) return "🏢";
    return SECTOR_ICONS[sector] ?? "🏢";
}

export default function EmpresasDestacadas({ onVerTodas }: EmpresasDestacadasProps) {
    const [empresas, setEmpresas] = useState<FeaturedOrganization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        organizationsApi
            .listFeatured()
            .then(setEmpresas)
            .catch((err) => setError(err.message ?? "Error al cargar empresas"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#346C84]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (empresas.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No hay empresas destacadas por el momento.</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Empresas Destacadas</h3>
                <button
                    onClick={onVerTodas}
                    className="text-[#346C84] hover:text-[#014766] font-medium transition"
                >
                    Ver todas
                </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {empresas.map((empresa) => (
                    <div
                        key={empresa.id_organizacion}
                        className="rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer bg-white"
                    >
                        {empresa.logo_url ? (
                            <img
                                src={empresa.logo_url}
                                alt={empresa.nombre}
                                className="h-12 w-12 object-contain mb-3 rounded"
                            />
                        ) : (
                            <div className="text-4xl mb-3">{getSectorIcon(empresa.sector)}</div>
                        )}
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{empresa.nombre}</h4>
                        <p className="text-sm text-gray-600 mb-4">{empresa.sector ?? "Sin sector"}</p>
                        <div className="flex items-center gap-2 text-[#346C84] font-medium">
                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20 7a2 2 0 00-2-2h-3V4a2 2 0 00-2-2h-2a2 2 0 00-2 2v1H6a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V7z" />
                            </svg>
                            {empresa.vacantes_activas} vacantes activas
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            {empresa.total_postulaciones} postulaciones
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
