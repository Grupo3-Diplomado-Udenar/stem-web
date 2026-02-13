import type { Career, University } from "../../../api/universities";
import type { EducationEntry } from "../types/student.types";
import { educationLevels, educationStatuses } from "../utils/student.constants";

interface EducationFormProps {
    isEditing: boolean;
    educationEntries: EducationEntry[];
    educationError: string | null;
    universities: University[];
    careersByUniversity: Record<number, Career[]>;
    isLoadingUniversities: boolean;
    loadingCareersByUniversity: Record<number, boolean>;
    handleEducationChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    addEducationEntry: () => void;
    handleRemoveCareer: (entry: EducationEntry) => void;
}

export default function EducationForm({
    isEditing,
    educationEntries,
    educationError,
    universities,
    careersByUniversity,
    isLoadingUniversities,
    loadingCareersByUniversity,
    handleEducationChange,
    addEducationEntry,
    handleRemoveCareer
}: EducationFormProps) {
    const resolveUniversityName = (entry: EducationEntry) => {
        if (entry.universityName) return entry.universityName;
        const universityId = Number(entry.universityId);
        return universities.find((university) => university.id_universidad === universityId)?.nombre;
    };

    const resolveCareerName = (entry: EducationEntry) => {
        if (entry.careerName) return entry.careerName;
        const careerId = Number(entry.careerId);
        const universityId = Number(entry.universityId);
        const careers = careersByUniversity[universityId] ?? [];
        return careers.find((career) => career.id_carrera === careerId)?.nombre;
    };

    const resolveLevelLabel = (entry: EducationEntry) =>
        educationLevels.find((level) => level.value === entry.level)?.label;

    const getCareersForEntry = (entry: EducationEntry) => {
        const universityId = Number(entry.universityId);
        if (Number.isNaN(universityId)) return [] as Career[];
        return careersByUniversity[universityId] ?? [];
    };

    const getFilteredCareersForEntry = (entry: EducationEntry) => {
        const careers = getCareersForEntry(entry);
        if (!entry.level) return careers;
        const levelFiltered = careers.filter((career) => career.nivel === entry.level);
        return levelFiltered.length === 0 ? careers : levelFiltered;
    };

    return (
        <div className="p-8">
            <div className="flex items-center gap-2 mb-6">
                <span className="text-xl"></span>
                <h4 className="text-lg font-bold text-gray-900">Formación Académica</h4>
            </div>
            {isEditing ? (
                <div className="space-y-6">
                    {educationEntries.map((entry, index) => {
                        const careers = getFilteredCareersForEntry(entry);
                        const universityId = Number(entry.universityId);
                        const isLoadingCareers =
                            !Number.isNaN(universityId) &&
                            loadingCareersByUniversity[universityId];
                        const removeLabel = entry.persisted ? "Eliminar" : "Quitar";
                        return (
                            <div key={entry.id} className="rounded-xl border border-gray-200 p-4">
                                <div className="flex items-center justify-between mb-4">
                                    <h5 className="text-sm font-semibold text-gray-700">
                                        Carrera {index + 1}
                                    </h5>
                                    {educationEntries.length > 1 || entry.persisted ? (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCareer(entry)}
                                            className="text-sm text-red-600 hover:text-red-700"
                                        >
                                            {removeLabel}
                                        </button>
                                    ) : null}
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Universidad *</label>
                                        <select
                                            name="universityId"
                                            value={entry.universityId}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            disabled={isLoadingUniversities}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                        >
                                            <option value="">
                                                {isLoadingUniversities
                                                    ? "Cargando universidades..."
                                                    : "Selecciona una universidad"}
                                            </option>
                                            {universities.map((university) => (
                                                <option
                                                    key={university.id_universidad}
                                                    value={university.id_universidad}
                                                >
                                                    {university.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                                        <select
                                            name="level"
                                            value={entry.level}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                        >
                                            <option value="">Selecciona nivel</option>
                                            {educationLevels.map((level) => (
                                                <option key={level.value} value={level.value}>
                                                    {level.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Carrera *</label>
                                        <select
                                            name="careerId"
                                            value={entry.careerId}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            disabled={!entry.universityId || Boolean(isLoadingCareers)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                        >
                                            <option value="">
                                                {!entry.universityId
                                                    ? "Selecciona universidad primero"
                                                    : isLoadingCareers
                                                        ? "Cargando carreras..."
                                                        : "Selecciona carrera"}
                                            </option>
                                            {entry.universityId && !isLoadingCareers && careers.length === 0 ? (
                                                <option value="" disabled>
                                                    No hay carreras disponibles
                                                </option>
                                            ) : null}
                                            {careers.map((career) => (
                                                <option key={career.id_carrera} value={career.id_carrera}>
                                                    {career.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                                        <select
                                            name="status"
                                            value={entry.status}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                        >
                                            <option value="">Selecciona estado</option>
                                            {educationStatuses.map((status) => (
                                                <option key={status.value} value={status.value}>
                                                    {status.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Semestre actual *</label>
                                        <input
                                            type="number"
                                            min={1}
                                            name="semester"
                                            value={entry.semester}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio *</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={entry.startDate}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de finalización</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={entry.endDate}
                                            onChange={(e) => handleEducationChange(index, e)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={addEducationEntry}
                            className="text-sm font-medium text-teal-700 hover:text-teal-800"
                        >
                            + Agregar carrera
                        </button>
                    </div>
                    {educationError ? (
                        <p className="text-sm text-red-600">{educationError}</p>
                    ) : null}
                </div>
            ) : educationEntries.length === 0 ? (
                <p className="text-sm text-gray-600">Sin formación académica registrada.</p>
            ) : (
                <div className="space-y-4">
                    {educationEntries.map((entry) => {
                        const universityName = resolveUniversityName(entry);
                        const careerName = resolveCareerName(entry);
                        const levelLabel = resolveLevelLabel(entry);
                        const statusLabel = educationStatuses.find(
                            (status) => status.value === entry.status
                        )?.label;
                        return (
                            <div key={entry.id} className="border-l-4 border-teal-600 pl-6 pb-4">
                                <h5 className="text-lg font-bold text-gray-900 mb-1">
                                    {careerName || "Carrera no definida"}
                                </h5>
                                <p className="text-sm text-gray-600 mb-2">
                                    {universityName || "Universidad no definida"}
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        {entry.startDate || "Sin fecha"} - {entry.endDate || "Actual"}
                                    </p>
                                    {levelLabel ? (
                                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                                            {levelLabel}
                                        </span>
                                    ) : null}
                                </div>
                                {entry.semester ? (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Semestre actual: {entry.semester}
                                    </p>
                                ) : null}
                                {statusLabel ? (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Estado: {statusLabel}
                                    </p>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
