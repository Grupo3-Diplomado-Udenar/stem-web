// TODO: Implementar consulta para traer ofertas recién publicadas
// Ordenar por fecha de creación descendente

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
    const [visibleCount, setVisibleCount] = useState(6);
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
        // Ordenamiento por fecha con validación segura
const getSafeTime = (date: Date) => {
    const time = date?.getTime?.();
    return Number.isNaN(time) ? 0 : time;
};

if (sortByDate === "newest") {
    result = [...result].sort(
        (a, b) => getSafeTime(b.publishedDate) - getSafeTime(a.publishedDate)
    );
} else if (sortByDate === "oldest") {
    result = [...result].sort(
        (a, b) => getSafeTime(a.publishedDate) - getSafeTime(b.publishedDate)
    );
} else {
    // Orden por defecto: más recientes primero
    result = [...result].sort(
        (a, b) => getSafeTime(b.publishedDate) - getSafeTime(a.publishedDate)
    );
}
        
       
        return result;
    }, [normalizedOrgFilter, normalizedTitleFilter, sortByDate, ofertas]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(6);
    }, [normalizedOrgFilter, normalizedTitleFilter, sortByDate]);

    const handleVerDetalles = (oferta: Oferta) => {
        setSelectedOferta(oferta);
        onVerDetalles?.(oferta);
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    const visibleOfertas = filteredOfertas.slice(0, visibleCount);
    const hasMore = visibleCount < filteredOfertas.length;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Ofertas Recientes</h3>
                    {filteredOfertas.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            {filteredOfertas.length} {filteredOfertas.length === 1 ? 'oferta encontrada' : 'ofertas encontradas'}
                        </p>
                    )}
                </div>
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
                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {visibleOfertas.map((oferta) => {
                            const isApplying = applyingId === oferta.id;
                            const isApplied = appliedIds?.includes(oferta.id) ?? false;
                            return (
                        <div key={oferta.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-teal-500 transition bg-white flex flex-col">
                            <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{oferta.title}</h4>
                            <p className="text-sm text-teal-600 font-medium mb-3">{oferta.company}</p>
                            <div className="space-y-1 text-xs text-gray-600 mb-4 flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Ubicación:</span>
                                    <span>{oferta.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Contrato:</span>
                                    <span>{oferta.type}</span>
                                </div>
                                <div className="text-gray-500">{oferta.posted}</div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button 
                                    onClick={() => handleVerDetalles(oferta)}
                                    className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Ver Detalles
                                </button>
                                <button 
                                    onClick={() => onPostular?.(oferta)}
                                    disabled={!isAuthenticated || isApplying || isApplied}
                                    title={!isAuthenticated ? "Debes iniciar sesión para postularte a esta oferta" : ""}
                                    className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isApplied ? "Postulado" : isApplying ? "Postulando..." : "Postularse"}
                                </button>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                    {hasMore && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition"
                            >
                                Ver más ofertas ({filteredOfertas.length - visibleCount} restantes)
                            </button>
                        </div>
                    )}
                </>
            )}
            {selectedOferta ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedOferta(null)}>
                    <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-200">
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedOferta.title}</h4>
                                <p className="text-sm text-teal-600 font-medium">{selectedOferta.company}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOferta(null)}
                                className="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 transition"
                                aria-label="Cerrar detalles"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="overflow-y-auto p-6 space-y-4 text-sm text-gray-700">
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Descripción</p>
                                <p className="text-gray-700 leading-relaxed">{selectedOferta.description}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Requisitos</p>
                                <p className="text-gray-700 leading-relaxed">{selectedOferta.requirements}</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 pt-2">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Tipo de contrato</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta.type}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Ubicación</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta.location}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Salario</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta.salary}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Fecha de publicación</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta.posted}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Fecha de cierre</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta.closeDate}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
