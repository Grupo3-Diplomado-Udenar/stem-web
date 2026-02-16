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
    description: string;
    requirements: string;
    salary: string;
    closeDate: string;
    publishedDate: Date;
    skills?: string[];
}

interface OfertasRecientesProps {
    onVerDetalles?: (oferta: Oferta) => void;
    onPostular?: (oferta: Oferta) => void;
    onVerTodas?: () => void;
    isAuthenticated?: boolean;
    isLoading?: boolean;
    errorMessage?: string;
    applyingId?: number | null;
    appliedIds?: number[];
    filterOrganization?: string;
    filterTitle?: string;
    sortByDate?: string;
}

export default function OfertasRecientes({
    onVerDetalles,
    onPostular,
    onVerTodas,
    isAuthenticated,
    isLoading,
    errorMessage,
    applyingId,
    appliedIds,
    filterOrganization,
    filterTitle,
    sortByDate,
}: OfertasRecientesProps) {
    const [ofertas, setOfertas] = useState<Oferta[]>([]);
    const [internalLoading, setInternalLoading] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);
    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
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

        const formatDate = (value: string | null | undefined) => {
            if (!value) return "No disponible";
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) return "No disponible";
            return new Intl.DateTimeFormat("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }).format(date);
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
                        description: record.descripcion,
                        requirements: record.requisitos,
                        salary: record.salario,
                        closeDate: formatDate(record.fecha_cierre),
                        publishedDate: new Date(record.fecha_publicacion),
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
    const deferredOrgFilter = useDeferredValue(filterOrganization ?? "");
    const deferredTitleFilter = useDeferredValue(filterTitle ?? "");
    const normalizeText = (value: string) =>
        value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    const normalizedOrgFilter = normalizeText(deferredOrgFilter);
    const normalizedTitleFilter = normalizeText(deferredTitleFilter);
    
    const filteredOfertas = useMemo(() => {
        let result = ofertas;

        // Filtro por organización
        if (normalizedOrgFilter) {
            result = result.filter((oferta) => 
                normalizeText(oferta.company).includes(normalizedOrgFilter)
            );
        }

        // Filtro por título
        if (normalizedTitleFilter) {
            result = result.filter((oferta) => 
                normalizeText(oferta.title).includes(normalizedTitleFilter)
            );
        }

        // Ordenamiento por fecha
        if (sortByDate === "newest") {
            result = [...result].sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime());
        } else if (sortByDate === "oldest") {
            result = [...result].sort((a, b) => a.publishedDate.getTime() - b.publishedDate.getTime());
        }

        return result;
    }, [normalizedOrgFilter, normalizedTitleFilter, sortByDate, ofertas]);

    const handleVerDetalles = (oferta: Oferta) => {
        setSelectedOferta(oferta);
        onVerDetalles?.(oferta);
    };

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
                                onClick={() => handleVerDetalles(oferta)}
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
            {selectedOferta ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <h4 className="text-xl font-bold text-gray-900">{selectedOferta.title}</h4>
                            <button
                                onClick={() => setSelectedOferta(null)}
                                className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100"
                                aria-label="Cerrar detalles"
                            >
                                Cerrar
                            </button>
                        </div>
                        <div className="mt-4 space-y-4 text-sm text-gray-700">
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Organizacion</p>
                                <p>{selectedOferta.company}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Descripcion</p>
                                <p>{selectedOferta.description}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500">Requisitos</p>
                                <p>{selectedOferta.requirements}</p>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">Tipo de contrato</p>
                                    <p>{selectedOferta.type}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">Ubicacion</p>
                                    <p>{selectedOferta.location}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">Salario</p>
                                    <p>{selectedOferta.salary}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">Fecha de publicacion</p>
                                    <p>{selectedOferta.posted}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500">Fecha de cierre</p>
                                    <p>{selectedOferta.closeDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
