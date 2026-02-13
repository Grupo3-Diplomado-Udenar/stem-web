import { useDeferredValue, useMemo } from "react";

export interface Oferta {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    posted: string;
    skills: string[];
}

interface OfertasRecientesProps {
    onVerDetalles?: (oferta: Oferta) => void;
    onPostular?: (oferta: Oferta) => void;
    onVerTodas?: () => void;
    isAuthenticated?: boolean;
    searchTerm?: string;
    isLoading?: boolean;
    errorMessage?: string;
    applyingId?: number | null;
    appliedIds?: number[];
}

export default function OfertasRecientes({
    onVerDetalles,
    onPostular,
    onVerTodas,
    isAuthenticated,
    searchTerm,
    isLoading,
    errorMessage,
    applyingId,
    appliedIds,
}: OfertasRecientesProps) {
    const ofertas = useMemo<Oferta[]>(
        () => [
            {
                id: 1,
                title: "Desarrollador Full Stack Junior",
                company: "TechCorp",
                location: "Pasto, Nariño",
                type: "Práctica Profesional",
                posted: "Publicado hace 2 días",
                skills: ["React", "Node.js", "PostgreSQL"],
            },
            {
                id: 2,
                title: "Analista de Datos",
                company: "DataLabs",
                location: "Remoto",
                type: "Contrato",
                posted: "Publicado hace 3 días",
                skills: ["Python", "Pandas", "SQL", "Tableau"],
            },
            {
                id: 3,
                title: "Ingeniero de Machine Learning",
                company: "InnovateTech",
                location: "Bogotá",
                type: "Práctica Profesional",
                posted: "Publicado hace 5 días",
                skills: ["Python", "TensorFlow", "Scikit-learn"],
            },
            {
                id: 5,
                title: "Desarrollador Backend",
                company: "CloudSystems",
                location: "Medellín",
                type: "Pasantía",
                posted: "Publicado hace 1 semana",
                skills: ["Java", "Spring Boot", "AWS"],
            },
        ],
        []
    );
    const deferredSearch = useDeferredValue(searchTerm ?? "");
    const normalizedSearch = deferredSearch.trim().toLowerCase();
    const filteredOfertas = useMemo(() => {
        if (!normalizedSearch) return ofertas;
        return ofertas.filter((oferta) => {
            const haystack = [
                oferta.title,
                oferta.company,
                oferta.location,
                oferta.type,
                oferta.skills.join(" "),
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(normalizedSearch);
        });
    }, [normalizedSearch, ofertas]);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Ofertas Recientes</h3>
                <button 
                    onClick={onVerTodas}
                    className="text-teal-600 hover:text-teal-700 font-medium transition"
                >
                    Ver todas
                </button>
            </div>
            {errorMessage ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {errorMessage}
                </div>
            ) : isLoading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
                    Cargando ofertas...
                </div>
            ) : filteredOfertas.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
                    No hay ofertas que coincidan con tu búsqueda.
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOfertas.map((oferta) => {
                        const isApplying = applyingId === oferta.id;
                        const isApplied = appliedIds?.includes(oferta.id) ?? false;
                        return (
                    <div key={oferta.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition bg-white flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <div className="text-3xl">💼</div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{oferta.title}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{oferta.company}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <span>📍 {oferta.location}</span>
                                        <span>📋 {oferta.type}</span>
                                        <span>• {oferta.posted}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {oferta.skills.map((skill) => (
                                            <span key={skill} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 flex flex-col gap-2">
                            <button 
                                onClick={() => onPostular?.(oferta)}
                                disabled={!isAuthenticated || isApplying || isApplied}
                                title={!isAuthenticated ? "Debes iniciar sesión para postularte a esta oferta" : ""}
                                className="px-6 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isApplied ? "Postulado" : isApplying ? "Postulando..." : "Postularse"}
                            </button>
                            <button 
                                onClick={() => onVerDetalles?.(oferta)}
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition whitespace-nowrap"
                            >
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                    );
                })}
                </div>
            )}
        </div>
    );
}
