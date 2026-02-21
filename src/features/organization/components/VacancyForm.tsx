import { EyeIcon } from "../../../components/ui/Icons";
import type { Oferta } from "../types/organization.types";
import VacancyPreview from "./VacancyPreview";

interface VacancyFormProps {
    oferta: Oferta;
    skillInput: string;
    setSkillInput: (value: string) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    addSkill: () => void;
    removeSkill: (skill: string) => void;
    handlePublish: () => void;
    onCancel: () => void;
}

export default function VacancyForm({
    oferta,
    skillInput,
    setSkillInput,
    handleInputChange,
    addSkill,
    removeSkill,
    handlePublish,
    onCancel,
}: VacancyFormProps) {
    return (
        <div className="grid grid-cols-2 gap-8">
            {/* Formulario */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    📋 Crear Nueva Vacante
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-teal-600 mb-2">Título del Puesto *</label>
                        <input
                            type="text"
                            name="titulo"
                            value={oferta.titulo}
                            onChange={handleInputChange}
                            placeholder="ej: Desarrollador"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-teal-600 mb-2">Descripción del Puesto *</label>
                        <textarea
                            name="descripcion"
                            value={oferta.descripcion}
                            onChange={handleInputChange}
                            placeholder="Describe el puesto y responsabilidades"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">{oferta.descripcion.length} caracteres</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-teal-600 mb-2">Tipo de Contrato *</label>
                        <select
                            name="tipo"
                            value={oferta.tipo}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                        >
                            <option>Práctica Profesional</option>
                            <option>Pasantía</option>
                            <option>Contrato Temporal</option>
                            <option>Contrato Permanente</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-teal-600 mb-2">Ubicación *</label>
                        <input
                            type="text"
                            name="ubicacion"
                            value={oferta.ubicacion}
                            onChange={handleInputChange}
                            placeholder="ej: Pasto, Nariño"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duración (Opcional)</label>
                        <input
                            type="text"
                            name="duracion"
                            value={oferta.duracion}
                            onChange={handleInputChange}
                            placeholder="ej: 6 meses"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Salario/Auxilio (Opcional)</label>
                        <input
                            type="text"
                            name="salario"
                            value={oferta.salario}
                            onChange={handleInputChange}
                            placeholder="ej: 3456"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Cierre (Opcional)</label>
                        <input
                            type="date"
                            name="fecha_cierre"
                            value={oferta.fecha_cierre}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-teal-600 mb-2">Habilidades Requeridas *</label>
                        <div className="flex gap-2 mb-3">
                            <select
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                            >
                                <option value="">Selecciona habilidades</option>
                                <option value="React">React</option>
                                <option value="Node.js">Node.js</option>
                                <option value="Python">Python</option>
                                <option value="Django">Django</option>
                                <option value="SQL">SQL</option>
                                <option value="PostgreSQL">PostgreSQL</option>
                                <option value="JavaScript">JavaScript</option>
                                <option value="TypeScript">TypeScript</option>
                            </select>
                            <button
                                onClick={addSkill}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                            >
                                + Agregar
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {oferta.habilidades.map((skill) => (
                                <span key={skill} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                    {skill}
                                    <button
                                        onClick={() => removeSkill(skill)}
                                        className="ml-2 font-bold hover:text-red-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 mt-8">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                        <EyeIcon className="h-5 w-5" />
                        Ocultar
                    </button>
                    <button
                        onClick={handlePublish}
                        className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                    >
                        ✈️ Publicar Oferta
                    </button>
                </div>
            </div>

            {/* Vista Previa */}
            <VacancyPreview oferta={oferta} />
        </div>
    );
}
