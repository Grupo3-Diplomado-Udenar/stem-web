import type { Oferta } from "../types/organization.types";

interface VacancyPreviewProps {
    oferta: Oferta;
}

export default function VacancyPreview({ oferta }: VacancyPreviewProps) {
    return (
        <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                Vista Previa para Estudiantes
            </h3>
            <p className="text-sm text-gray-600 mb-4">Así verán los estudiantes tu oferta publicada</p>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl"></div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {oferta.titulo || "Título del Puesto"}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">Tu Empresa</p>
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                            {oferta.ubicacion && <p> {oferta.ubicacion}</p>}
                            {oferta.tipo && <p>{oferta.tipo}</p>}
                            {oferta.duracion && <p> Duración: {oferta.duracion}</p>}
                            {oferta.salario && <p>{oferta.salario}</p>}
                        </div>
                    </div>
                </div>

                {oferta.descripcion && (
                    <>
                        <h5 className="font-bold text-gray-900 mb-2">Descripción</h5>
                        <p className="text-sm text-gray-600 mb-4">{oferta.descripcion}</p>
                    </>
                )}

                {oferta.habilidades.length > 0 && (
                    <>
                        <h5 className="font-bold text-gray-900 mb-2">Habilidades Requeridas</h5>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {oferta.habilidades.map((skill) => (
                                <span key={skill} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </>
                )}

                <button className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition">
                    Postularme a esta oferta
                </button>
            </div>

            <p className="text-xs text-blue-600 mt-4">
                Esta es una vista previa de cómo los estudiantes verán tu oferta
            </p>
        </div>
    );
}
