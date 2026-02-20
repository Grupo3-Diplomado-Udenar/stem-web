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

    const handleVerDetalles = (oferta: Oferta) => {
        setSelectedOferta(oferta);
        onVerDetalles?.(oferta);
    };

    const visibleOfertas = filteredOfertas;
    const showMobileDetail = Boolean(selectedOferta);

    return (
        <div>
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Ofertas Recientes</h3>
                <p className="text-sm text-gray-600 mt-1">
                    {filteredOfertas.length} {filteredOfertas.length === 1 ? "oferta encontrada" : "ofertas encontradas"}
                </p>
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
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                        {visibleOfertas.map((oferta) => {
                            const isApplying = applyingId === oferta.id;
                            const isApplied = appliedIds?.includes(oferta.id) ?? false;
                            const isSelected = selectedOferta?.id === oferta.id;
                            return (
                                <button
                                    key={oferta.id}
                                    onClick={() => handleVerDetalles(oferta)}
                                    className={`w-full text-left border rounded-xl p-4 transition bg-white hover:shadow-lg hover:border-[#346C84] ${
                                        isSelected ? "border-[#014766] ring-2 ring-[#014766]/20" : "border-gray-200"
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h4 className="text-base font-bold text-gray-900 mb-1 line-clamp-2">{oferta.title}</h4>
                                            <p className="text-sm text-[#346C84] font-medium">{oferta.company}</p>
                                        </div>
                                        <span className="text-xs text-gray-400">{oferta.posted}</span>
                                    </div>
                                    <div className="mt-3 grid gap-1 text-xs text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Ubicación:</span>
                                            <span>{oferta.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium">Contrato:</span>
                                            <span>{oferta.type}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onPostular?.(oferta);
                                            }}
                                            disabled={!isAuthenticated || isApplying || isApplied}
                                            title={!isAuthenticated ? "Debes iniciar sesión para postularte a esta oferta" : ""}
                                            className="px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isApplied ? "Postulado" : isApplying ? "Postulando..." : "Postularse"}
                                        </button>
                                        <span className="text-xs text-gray-500 sm:ml-auto">
                                            Cierre convocatoria: {oferta.closeDate}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    <div className="hidden lg:block">
                        <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
                            {selectedOferta ? (
                                <div className="flex h-full flex-col">
                                    <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-200">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedOferta.title}</h4>
                                            <p className="text-sm text-[#346C84] font-medium">{selectedOferta.company}</p>
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
                                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Cierre convocatoria</p>
                                                <p className="text-gray-900 font-medium">{selectedOferta.closeDate}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                onClick={() => onPostular?.(selectedOferta)}
                                                disabled={!isAuthenticated || applyingId === selectedOferta.id || appliedIds?.includes(selectedOferta.id)}
                                                title={!isAuthenticated ? "Debes iniciar sesión para postularte a esta oferta" : ""}
                                                className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {appliedIds?.includes(selectedOferta.id)
                                                    ? "Postulado"
                                                    : applyingId === selectedOferta.id
                                                        ? "Postulando..."
                                                        : "Postularse"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    Selecciona una oferta para ver los detalles.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showMobileDetail ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 lg:hidden"
                    onClick={() => setSelectedOferta(null)}
                >
                    <div
                        className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white shadow-xl flex flex-col"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 p-6 border-b border-gray-200">
                            <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-1">{selectedOferta?.title}</h4>
                                <p className="text-sm text-[#346C84] font-medium">{selectedOferta?.company}</p>
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
                                <p className="text-gray-700 leading-relaxed">{selectedOferta?.description}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Requisitos</p>
                                <p className="text-gray-700 leading-relaxed">{selectedOferta?.requirements}</p>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 pt-2">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Tipo de contrato</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta?.type}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Ubicación</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta?.location}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Salario</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta?.salary}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Fecha de publicación</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta?.posted}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Cierre convocatoria</p>
                                    <p className="text-gray-900 font-medium">{selectedOferta?.closeDate}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <button
                                    onClick={() => selectedOferta && onPostular?.(selectedOferta)}
                                    disabled={!selectedOferta || !isAuthenticated || applyingId === selectedOferta.id || appliedIds?.includes(selectedOferta.id)}
                                    title={!isAuthenticated ? "Debes iniciar sesión para postularte a esta oferta" : ""}
                                    className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-950 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {selectedOferta && appliedIds?.includes(selectedOferta.id)
                                        ? "Postulado"
                                        : selectedOferta && applyingId === selectedOferta.id
                                            ? "Postulando..."
                                            : "Postularse"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
