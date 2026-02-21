import { UserIcon, ClockIcon, BriefcaseIcon, CheckCircleIcon, InformationCircleIcon } from "../../../components/ui/Icons";
import { ApplicationStatus } from "../../../api/applications";
import { useUpdateApplicationStatusMutation } from "../../../hook/useApplications";
import { useState } from "react";
import StudentProfileModal from "./StudentProfileModal";

interface OrganizationApplicantsTabProps {
    applicantsQuery: any;
}

export default function OrganizationApplicantsTab({ applicantsQuery }: OrganizationApplicantsTabProps) {
    const applicants = applicantsQuery.data || [];
    const updateStatusMutation = useUpdateApplicationStatusMutation();
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const handleStatusChange = (id: number, newStatus: string) => {
        setUpdatingId(id);
        updateStatusMutation.mutate(
            { id, dto: { estado: newStatus } },
            {
                onSuccess: () => {
                    setUpdatingId(null);
                },
                onError: (error: any) => {
                    setUpdatingId(null);
                    alert(`Error al actualizar: ${error.message || 'Intenta de nuevo'}`);
                },
            }
        );
    };

    const handleHire = (id: number) => {
        if (window.confirm("¿Estás seguro de que deseas contratar a este candidato? El estado de la postulación cambiará a 'ACEPTADA'.")) {
            handleStatusChange(id, ApplicationStatus.ACCEPTED);
        }
    };

    const getStatusColor = (status: string) => {
        const normalizedStatus = status?.toUpperCase();
        switch (normalizedStatus) {
            case ApplicationStatus.ACCEPTED:
            case 'ACEPTADA':
                return 'bg-green-100 text-green-800';
            case ApplicationStatus.REJECTED:
            case 'RECHAZADA':
                return 'bg-red-100 text-red-800';
            case ApplicationStatus.IN_REVIEW:
            case 'EN_REVISION':
                return 'bg-blue-100 text-blue-800';
            case ApplicationStatus.WITHDRAWN:
            case 'RETIRADA':
                return 'bg-gray-100 text-gray-800';
            case ApplicationStatus.PENDING:
            case 'PENDIENTE':
            default:
                return 'bg-yellow-100 text-yellow-800';
        }
    };

    if (applicantsQuery.isLoading) {
        return (
            <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Cargando candidatos...</p>
            </div>
        );
    }

    if (applicantsQuery.isError) {
        return (
            <div className="text-center py-20 bg-red-50 rounded-3xl border-2 border-dashed border-red-200">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar aplicantes</h2>
                <p className="text-gray-500">{applicantsQuery.error?.message || "Intenta recargar la página"}</p>
            </div>
        );
    }

    if (applicants.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <div className="text-6xl mb-4">🎓</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin aplicantes aún</h2>
                <p className="text-gray-500">Publica vacantes para atraer al mejor talento STEM de la región.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {selectedStudentId && (
                <StudentProfileModal
                    studentId={selectedStudentId}
                    onClose={() => setSelectedStudentId(null)}
                />
            )}

            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Candidatos Postulados</h2>
                <p className="text-gray-500 mt-1">Revisa el perfil de los estudiantes que aplicaron a tus ofertas</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-teal-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-teal-900 uppercase tracking-wide">
                                    Vacante
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-teal-900 uppercase tracking-wide">
                                    Nombre Estudiante
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-teal-900 uppercase tracking-wide">
                                    Fecha de Postulación
                                </th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-teal-900 uppercase tracking-wide">
                                    Estado Postulación
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-teal-900 uppercase tracking-wide">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {applicants.map((app: any) => (
                                <tr key={app.id_postulacion} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <BriefcaseIcon className="h-5 w-5 text-teal-600 flex-shrink-0" />
                                            <span className="font-semibold text-gray-900">
                                                {app.oferta?.titulo || 'Oferta no disponible'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                                                <UserIcon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900">
                                                    {app.estudiante?.nombres || 'N/A'} {app.estudiante?.apellidos || ''}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {app.estudiante?.email || 'Email no disponible'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <ClockIcon className="h-4 w-4 text-gray-400" />
                                            <span>{new Date(app.fecha_postulacion).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={app.estado || ApplicationStatus.PENDING}
                                            onChange={(e) => handleStatusChange(app.id_postulacion, e.target.value)}
                                            disabled={updatingId === app.id_postulacion}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-0 cursor-pointer transition-all ${getStatusColor(app.estado)} ${updatingId === app.id_postulacion ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
                                                }`}
                                        >
                                            <option value={ApplicationStatus.PENDING}>Pendiente</option>
                                            <option value={ApplicationStatus.IN_REVIEW}>En Revisión</option>
                                            <option value={ApplicationStatus.ACCEPTED}>Aceptada</option>
                                            <option value={ApplicationStatus.REJECTED}>Rechazada</option>
                                            <option value={ApplicationStatus.WITHDRAWN}>Retirada</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => setSelectedStudentId(app.id_num)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-teal-600 text-teal-600 text-xs rounded-lg font-bold hover:bg-teal-50 transition-colors shadow-sm"
                                            >
                                                <InformationCircleIcon className="h-4 w-4" />
                                                Ver Perfil
                                            </button>
                                            {app.estado !== ApplicationStatus.ACCEPTED && (
                                                <button
                                                    onClick={() => handleHire(app.id_postulacion)}
                                                    disabled={updatingId === app.id_postulacion}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white text-xs rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 disabled:opacity-50"
                                                >
                                                    <CheckCircleIcon className="h-4 w-4" />
                                                    Contratar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
