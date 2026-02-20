import { UserIcon, MapPinIcon, ClockIcon, BriefcaseIcon } from "../../../components/ui/Icons";

interface OrganizationApplicantsTabProps {
    applicantsQuery: any;
}

export default function OrganizationApplicantsTab({ applicantsQuery }: OrganizationApplicantsTabProps) {
    const applicants = applicantsQuery.data || [];

    if (applicantsQuery.isLoading) {
        return (
            <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Cargando candidatos...</p>
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
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Candidatos Postulados</h2>
                <p className="text-gray-500 mt-1">Revisa el perfil de los estudiantes que aplicaron a tus ofertas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {applicants.map((app: any) => (
                    <div key={app.id_postulacion} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <UserIcon className="h-8 w-8" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">
                                    {app.estudiante.nombres} {app.estudiante.apellidos}
                                </h3>
                                <p className="text-teal-600 text-sm font-semibold flex items-center gap-1">
                                    <BriefcaseIcon className="h-4 w-4" />
                                    {app.oferta.titulo}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <MapPinIcon className="h-4 w-4 text-gray-400" />
                                {app.estudiante.ciudad || "Ubicación no especificada"}
                            </div>
                            <div className="flex items-center gap-2">
                                <ClockIcon className="h-4 w-4 text-gray-400" />
                                Postulado el {new Date(app.fecha_postulacion).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 flex items-center justify-center text-gray-400">@</div>
                                {app.estudiante.email}
                            </div>
                            {app.estudiante.celular && (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 flex items-center justify-center text-gray-400">📞</div>
                                    {app.estudiante.celular}
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button className="flex-1 py-3 bg-blue-900 text-white rounded-xl font-bold hover:bg-blue-950 transition-all shadow-lg shadow-blue-900/10">
                                Ver Perfil
                            </button>
                            <button className="px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                                Contactar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
