import type { Oferta } from "../types/organization.types";
import VacancyForm from "./VacancyForm";

interface OrganizationVacanciesTabProps {
    showForm: boolean;
    setShowForm: (show: boolean) => void;
    oferta: Oferta;
    skillInput: string;
    setSkillInput: (value: string) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    addSkill: () => void;
    removeSkill: (skill: string) => void;
    handlePublish: () => void;
}

export default function OrganizationVacanciesTab({
    showForm,
    setShowForm,
    oferta,
    skillInput,
    setSkillInput,
    handleInputChange,
    addSkill,
    removeSkill,
    handlePublish,
}: OrganizationVacanciesTabProps) {
    if (!showForm) {
        return (
            <div className="text-center py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Gestiona tus Vacantes</h2>
                <p className="text-gray-600 mb-8">Crea y publica nuevas oportunidades para atraer talento STEM</p>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-3 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition"
                >
                    + Crear Nueva Vacante
                </button>
            </div>
        );
    }

    return (
        <VacancyForm
            oferta={oferta}
            skillInput={skillInput}
            setSkillInput={setSkillInput}
            handleInputChange={handleInputChange}
            addSkill={addSkill}
            removeSkill={removeSkill}
            handlePublish={handlePublish}
            onCancel={() => setShowForm(false)}
        />
    );
}
