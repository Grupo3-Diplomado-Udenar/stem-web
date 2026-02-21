import { useEffect, useState } from "react";
import { getUser } from "../../../api/auth";
import { applicationsApi, type ApplicationRecord } from "../../../api/applications";
import { offersApi } from "../../../api/offers";
import { organizationsApi } from "../../../api/organizations";

interface EnrichedApplication extends ApplicationRecord {
    offerTitle?: string;
    organizationName?: string;
}

export default function StudentApplicationsTab() {
    const [applications, setApplications] = useState<EnrichedApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const user = getUser();
        if (!user?.id) {
            setError("No se pudo identificar al usuario");
            setLoading(false);
            return;
        }

        const fetchApplications = async () => {
            try {
                setLoading(true);
                const records = await applicationsApi.listByStudent(user.id);
                
                // Enrich with offer and organization data
                const allOffers = await offersApi.list();
                const enrichedRecords = await Promise.all(
                    records.map(async (record) => {
                        const offer = allOffers.find(o => o.id_oferta === record.id_oferta);
                        let organizationName = "Organización";
                        
                        if (offer?.id_organizacion) {
                            try {
                                const org = await organizationsApi.get(offer.id_organizacion);
                                organizationName = org.nombre;
                            } catch {
                                // Keep default if fetch fails
                            }
                        }
                        
                        return {
                            ...record,
                            offerTitle: offer?.titulo || `Oferta #${record.id_oferta}`,
                            organizationName,
                        };
                    })
                );
                
                setApplications(enrichedRecords);
                setError(null);
            } catch (err) {
                const message = err instanceof Error ? err.message : "No se pudieron cargar las postulaciones.";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();

        // Refresh every 30 seconds
        const intervalId = setInterval(fetchApplications, 30000);

        // Refresh when tab becomes visible
        const handleVisibility = () => {
            if (document.visibilityState === "visible") {
                fetchApplications();
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);

        return () => {
            clearInterval(intervalId);
            document.removeEventListener("visibilitychange", handleVisibility);
        };
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("es-CO", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            PENDIENTE: { label: "Pendiente", className: "bg-yellow-100 text-yellow-700" },
            EN_REVISION: { label: "En Revisión", className: "bg-blue-100 text-blue-700" },
            ACEPTADA: { label: "Aceptada", className: "bg-green-100 text-green-700" },
            RECHAZADA: { label: "Rechazada", className: "bg-red-100 text-red-700" },
        };

        const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100 text-gray-700" };

        return (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}>
                {statusInfo.label}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">Mis Postulaciones</h3>
                    {applications.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            {applications.length} {applications.length === 1 ? 'postulación' : 'postulaciones'}
                        </p>
                    )}
                </div>
            </div>

            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
                    {error}
                </div>
            ) : loading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600">
                    Cargando postulaciones...
                </div>
            ) : applications.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                    <div className="text-4xl mb-4">📋</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No tienes postulaciones</h4>
                    <p className="text-gray-600">Explora las ofertas laborales y postúlate a las que te interesen.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications.map((application) => (
                        <div
                            key={application.id_postulacion}
                            className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Título de Oferta</p>
                                    <p className="text-sm font-bold text-gray-900">{application.offerTitle}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Organización</p>
                                    <p className="text-sm font-medium text-teal-600">{application.organizationName}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Estado</p>
                                    <div>{getStatusBadge(application.estado)}</div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Fecha de Postulación</p>
                                    <p className="text-sm text-gray-700">{formatDate(application.fecha_postulacion)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
