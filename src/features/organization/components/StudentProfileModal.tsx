import { useStudentQuery, useStudentCareersQuery } from "../../../hook/useStudents";
import { UserIcon, BookOpenIcon, MapPinIcon, EnvelopeIcon, PhoneIcon, XMarkIcon } from "../../../components/ui/Icons";

interface StudentProfileModalProps {
    studentId: string;
    onClose: () => void;
}

export default function StudentProfileModal({ studentId, onClose }: StudentProfileModalProps) {
    const { data: student, isLoading: loadingStudent } = useStudentQuery(studentId);
    const { data: careers, isLoading: loadingCareers } = useStudentCareersQuery(studentId);

    const isLoading = loadingStudent || loadingCareers;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 bg-teal-600 text-white flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                            <UserIcon className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Perfil del Candidato</h2>
                            <p className="text-teal-100 text-sm font-medium">Información detallada del estudiante</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium">Cargando información...</p>
                        </div>
                    ) : student ? (
                        <div className="space-y-8">
                            {/* Basic Info */}
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <UserIcon className="h-5 w-5 text-teal-600" />
                                    Datos Personales
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre Completo</p>
                                        <p className="font-semibold text-gray-900 text-lg">{student.nombres} {student.apellidos}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Identificación</p>
                                        <p className="font-semibold text-gray-900">{student.tipo_identificacion}: {student.numero_identificacion}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email de Contacto</p>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <EnvelopeIcon className="h-4 w-4 text-teal-600" />
                                            <span className="font-medium">{student.email}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Teléfono / Celular</p>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <PhoneIcon className="h-4 w-4 text-teal-600" />
                                            <span className="font-medium">{student.celular || 'No proporcionado'}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 col-span-full">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ubicación</p>
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <MapPinIcon className="h-4 w-4 text-teal-600" />
                                            <span className="font-medium">{student.ciudad || 'No proporcionada'}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Academic Info */}
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <BookOpenIcon className="h-5 w-5 text-teal-600" />
                                    Formación Académica
                                </h3>
                                {careers && careers.length > 0 ? (
                                    <div className="space-y-4">
                                        {careers.map((c: any) => (
                                            <div key={c.id_carrera} className="bg-white border-2 border-teal-50 p-6 rounded-2xl hover:border-teal-200 transition-all shadow-sm">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-teal-900 text-lg">{c.carrera.nombre}</h4>
                                                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                                                        {c.estado}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 font-medium">{c.carrera.universidad.nombre}</p>
                                                <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                                                    <div className="bg-gray-50 px-3 py-1 rounded-md">
                                                        <span className="font-bold text-gray-700">Nivel:</span> {c.carrera.nivel}
                                                    </div>
                                                    <div className="bg-gray-50 px-3 py-1 rounded-md">
                                                        <span className="font-bold text-gray-700">Semestre:</span> {c.semestre_actual}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                        <p className="text-gray-500 font-medium">No se ha registrado formación académica.</p>
                                    </div>
                                )}
                            </section>
                        </div>
                    ) : (
                        <p className="text-center text-red-500 py-10">No se pudo cargar la información del estudiante.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
                    >
                        Cerrar Perfil
                    </button>
                </div>
            </div>
        </div>
    );
}
