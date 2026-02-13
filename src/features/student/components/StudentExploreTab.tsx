import { useEffect, useRef, useState } from "react";
import { getUser } from "../../../api/auth";
import { applicationsApi } from "../../../api/applications";
import EmpresasDestacadas from "../../../components/EmpresasDestacadas";
import FiltersPanel from "../../../components/FiltersPanel";
import OfertasRecientes, { type Oferta } from "../../../components/OfertasRecientes";
import Toast from "../../../components/Toast";

export default function StudentExploreTab() {
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [applyingId, setApplyingId] = useState<number | null>(null);
    const [appliedIds, setAppliedIds] = useState<number[]>([]);
    const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }
        toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const user = getUser();
        if (!user?.id) return;

        const fetchApplications = () => {
            applicationsApi
                .listByStudent(user.id)
                .then((records) => {
                    setAppliedIds(records.map((record) => record.id_oferta));
                })
                .catch((error) => {
                    const message = error instanceof Error ? error.message : "No se pudieron cargar las postulaciones.";
                    if (message.includes("404") || message.toLowerCase().includes("not found")) {
                        return;
                    }
                    showToast(message, "error");
                });
        };

        fetchApplications();
        const intervalId = setInterval(fetchApplications, 30000);

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

    const handlePostular = async (oferta: Oferta) => {
        const user = getUser();
        if (!user?.id) {
            showToast("Debes iniciar sesión como estudiante.", "error");
            return;
        }

        try {
            setApplyingId(oferta.id);
            await applicationsApi.create({ id_num: user.id, id_oferta: oferta.id });
            setAppliedIds((prev) => (prev.includes(oferta.id) ? prev : [...prev, oferta.id]));
            showToast("Postulación enviada con éxito.", "success");
        } catch (error) {
            const message = error instanceof Error ? error.message : "No se pudo postular.";
            showToast(message, "error");
        } finally {
            setApplyingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Encuentra tu Práctica Profesional Ideal</h2>
                <p className="text-blue-100">Conectamos talento STEM con las mejores oportunidades del sector productivo</p>
            </div>

            {/* Filtros */}
            <FiltersPanel />

            {/* Empresas Destacadas */}
            <EmpresasDestacadas onVerTodas={() => { }} />

            {/* Ofertas Recientes */}
            <OfertasRecientes
                onPostular={handlePostular}
                onVerDetalles={(oferta) => {
                    console.log("Ver detalles de oferta:", oferta);
                }}
                onVerTodas={() => { }}
                isAuthenticated={true}
                searchTerm=""
                applyingId={applyingId}
                appliedIds={appliedIds}
            />
            {toast ? <Toast message={toast.message} type={toast.type} position="top-center" /> : null}
        </div>
    );
}
