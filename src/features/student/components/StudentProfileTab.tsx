import { PencilSquareIcon } from "../../../components/ui/Icons";
import ProfileCard from "./ProfileCard";
import ContactInfo from "./ContactInfo";
import EducationForm from "./EducationForm";
import type { Career, University } from "../../../api/universities";
import type { EducationEntry, StudentProfile } from "../types/student.types";

interface StudentProfileTabProps {
    profileLoading: boolean;
    studentLoading: boolean;
    profileError: boolean;
    studentError: boolean;
    profileErrorMessage: string;
    studentErrorMessage: string;
    student?: StudentProfile;
    isEditing: boolean;
    editData: Partial<StudentProfile>;
    educationEntries: EducationEntry[];
    educationError: string | null;
    universities: University[];
    careersByUniversity: Record<number, Career[]>;
    isLoadingUniversities: boolean;
    loadingCareersByUniversity: Record<number, boolean>;
    isSaving: boolean;

    // Handlers
    handleEditClick: () => void;
    handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleEducationChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    addEducationEntry: () => void;
    handleRemoveCareer: (entry: EducationEntry) => void;
    handleCancel: () => void;
    handleSaveProfile: () => void;
}

export default function StudentProfileTab({
    profileLoading,
    studentLoading,
    profileError,
    studentError,
    profileErrorMessage,
    studentErrorMessage,
    student,
    isEditing,
    editData,
    educationEntries,
    educationError,
    universities,
    careersByUniversity,
    isLoadingUniversities,
    loadingCareersByUniversity,
    isSaving,

    handleEditClick,
    handleEditInputChange,
    handleEducationChange,
    addEducationEntry,
    handleRemoveCareer,
    handleCancel,
    handleSaveProfile
}: StudentProfileTabProps) {
    if (profileLoading || studentLoading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">Cargando perfil...</p>
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{profileErrorMessage}</p>
            </div>
        );
    }

    if (studentError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{studentErrorMessage}</p>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No hay datos de perfil disponibles.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header del Perfil */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mi Perfil Profesional</h2>
                {!isEditing ? (
                    <button
                        onClick={handleEditClick}
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition flex items-center gap-2"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Editar Perfil
                    </button>
                ) : null}
            </div>

            {/* Tarjeta de Perfil */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <ProfileCard
                    student={student}
                    isEditing={isEditing}
                    editData={editData}
                    handleEditInputChange={handleEditInputChange}
                />

                {/* Información de Contacto */}
                <ContactInfo
                    student={student}
                    isEditing={isEditing}
                    editData={editData}
                    handleEditInputChange={handleEditInputChange}
                />

                {/* Formación Académica */}
                <EducationForm
                    isEditing={isEditing}
                    educationEntries={educationEntries}
                    educationError={educationError}
                    universities={universities}
                    careersByUniversity={careersByUniversity}
                    isLoadingUniversities={isLoadingUniversities}
                    loadingCareersByUniversity={loadingCareersByUniversity}
                    handleEducationChange={handleEducationChange}
                    addEducationEntry={addEducationEntry}
                    handleRemoveCareer={handleRemoveCareer}
                />
            </div>

            {isEditing ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        onClick={handleCancel}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition disabled:opacity-50"
                    >
                        {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            ) : null}
        </div>
    );
}
