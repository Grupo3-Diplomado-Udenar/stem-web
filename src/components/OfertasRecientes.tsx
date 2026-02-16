import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { offersApi } from "../api/offers";
import { organizationsApi } from "../api/organizations";

export interface Oferta {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    posted: string;
    skills?: string[];
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
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [internalLoading, setInternalLoading] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);
    const orgCacheRef = useRef<Map<string, string>>(new Map());

    useEffect(() => {
        let isMounted = true;

        const formatPosted = (value: string | null | undefined) => {
            if (!value) return "Publicado";
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return "Publicado";
            const formatted = new Intl.DateTimeFormat("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(date);
            return `Publicado el ${formatted}`;
        };

        const resolveOrganizationNames = async (organizationIds: string[]) => {
            const unique = Array.from(new Set(organizationIds)).filter(Boolean);
            const missing = unique.filter((id) => !orgCacheRef.current.has(id));
            if (missing.length === 0) return;

            const results = await Promise.all(
                missing.map(async (id) => {
                    try {
                        const organization = await organizationsApi.get(id);
                        return { id, name: organization.nombre };
                    } catch {
                        return { id, name: "Organización" };
                    }
                })
            );

            results.forEach(({ id, name }) => {
                orgCacheRef.current.set(id, name);
            });
        };

        const fetchOffers = async () => {
            setInternalLoading(true);
            setInternalError(null);
            try {
                const records = await offersApi.list();
                const organizationIds = records.map((record) => record.id_organizacion);
                await resolveOrganizationNames(organizationIds);

                if (!isMounted) return;

                setOfertas(
                    records.map((record) => ({
                        id: record.id_oferta,
                        title: record.titulo,
                        company: orgCacheRef.current.get(record.id_organizacion) ?? "Organización",
                        location: record.ubicacion,
                        type: record.tipo_contrato,
                        posted: formatPosted(record.fecha_publicacion),
                        skills: [],
                    }))
                );
            } catch (error) {
                if (!isMounted) return;
                const message = error instanceof Error ? error.message : "No se pudieron cargar las ofertas.";
                setInternalError(message);
            } finally {
                if (isMounted) {
                    setInternalLoading(false);
                }
            }
        };

        fetchOffers();
        const intervalId = setInterval(fetchOffers, 30000);

        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchOffers();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", handleVisibility);
            isMounted = false;
        };
    }, []);

    const loading = isLoading ?? internalLoading;
    const error = errorMessage ?? internalError;
    const deferredSearch = useDeferredValue(searchTerm ?? "");
    const normalizedSearch = deferredSearch.trim().toLowerCase();
    const filteredOfertas = useMemo(() => {
        if (!normalizedSearch) return ofertas;
        return ofertas.filter((oferta) => {
            const skillsText = oferta.skills?.join(" ") ?? "";
            const haystack = [
                oferta.title,
                oferta.company,
                oferta.location,
                oferta.type,
                skillsText,
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
            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error}
                </div>
            ) : loading ? (
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
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">{oferta.title}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{oferta.company}</p>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                        <span>Ubicacion: {oferta.location}</span>
                                        <span>Contrato: {oferta.type}</span>
                                        <span>• {oferta.posted}</span>
                                    </div>
                                    {oferta.skills && oferta.skills.length > 0 ? (
                                        <div className="flex gap-2 flex-wrap">
                                            {oferta.skills.map((skill) => (
                                                <span key={skill} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : null}
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
