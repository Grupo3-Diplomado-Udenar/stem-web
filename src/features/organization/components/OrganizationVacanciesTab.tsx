import type { Oferta } from "../types/organization.types";
import VacancyForm from "./VacancyForm";
import { PencilSquareIcon, TrashIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from "../../../components/ui/Icons";

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
    offersQuery: any;
    handleEditOffer: (offer: any) => void;
    handleDeleteOffer: (id: number) => void;
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
    offersQuery,
    handleEditOffer,
    handleDeleteOffer,
}: OrganizationVacanciesTabProps) {
    if (showForm) {
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

    const offers = offersQuery.data || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Gestión de Vacantes</h2>
                    <p className="text-gray-500 mt-1">Crea y administra tus ofertas laborales</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="px-8 py-3 bg-teal-600 text-white rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 transform hover:-translate-y-0.5"
                >
                    + Crear Nueva Vacante
                </button>
            </div>

            {offersQuery.isLoading ? (
                <div className="text-center py-20">
                    <p className="text-gray-500 animate-pulse">Cargando vacantes...</p>
                </div>
            ) : offers.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-6xl mb-4">📢</div>
                    <h3 className="text-xl font-bold text-gray-900">Aún no tienes vacantes publicadas</h3>
                    <p className="text-gray-500 mt-2">Empieza a buscar talento hoy mismo</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {offers.map((offer: any) => (
                        <div key={offer.id_oferta} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 group">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors">
                                            {offer.titulo}
                                        </h3>
                                        <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {offer.tipo_contrato}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 line-clamp-2 leading-relaxed">
                                        {offer.descripcion}
                                    </p>

                                    <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                                            {offer.ubicacion}
                                        </div>
                                        {offer.salario && (
                                            <div className="flex items-center gap-2">
                                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                                {offer.salario}
                                            </div>
                                        )}
                                        {offer.fecha_publicacion && (
                                            <div className="flex items-center gap-2">
                                                <ClockIcon className="h-5 w-5 text-gray-400" />
                                                Publicado: {new Date(offer.fecha_publicacion).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    {offer.requisitos && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {offer.requisitos.split(", ").map((req: string) => (
                                                <span key={req} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                                                    {req}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex md:flex-col gap-3 justify-end">
                                    <button
                                        onClick={() => handleEditOffer(offer)}
                                        className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                                        title="Editar vacante"
                                    >
                                        <PencilSquareIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteOffer(offer.id_oferta)}
                                        className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                        title="Eliminar vacante"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
