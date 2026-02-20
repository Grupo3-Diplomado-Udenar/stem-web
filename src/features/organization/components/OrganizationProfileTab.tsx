import { PencilSquareIcon } from "../../../components/ui/Icons";
import OrganizationCard from "./OrganizationCard";
import OrganizationContactInfo from "./OrganizationContactInfo";
import OrganizationDescription from "./OrganizationDescription";
import type { OrganizationProfile } from "../types/organization.types";
import type { UseMutationResult } from "@tanstack/react-query";

interface OrganizationProfileTabProps {
    profile?: OrganizationProfile;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string;
    isEditing: boolean;
    editData: Partial<OrganizationProfile>;
    handleEditClick: () => void;
    handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSaveProfile: () => void;
    handleCancelEdit: () => void;
    updateProfileMutation: UseMutationResult<any, unknown, Partial<OrganizationProfile>, unknown>;
}

export default function OrganizationProfileTab({
    profile,
    isLoading,
    isError,
    errorMessage,
    isEditing,
    editData,
    handleEditClick,
    handleEditInputChange,
    handleSaveProfile,
    handleCancelEdit,
    updateProfileMutation,
}: OrganizationProfileTabProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Cargando perfil...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-red-600 font-medium">{errorMessage}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-gray-600 font-medium">No hay datos de perfil disponibles.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Mi Perfil Organizacional</h2>
                    <p className="text-gray-500 mt-1">Gestiona la información pública de tu empresa</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEditClick}
                        className="px-6 py-2.5 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-950 transition-all shadow-lg hover:shadow-blue-900/20 flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <PencilSquareIcon className="h-5 w-5" />
                        Editar Perfil
                    </button>
                )}
            </div>

            {/* Tarjeta de Perfil Modular */}
            <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-xl shadow-gray-200/50 transition-all duration-300">
                <OrganizationCard
                    profile={profile}
                    isEditing={isEditing}
                    editData={editData}
                    handleEditInputChange={handleEditInputChange}
                />

                <OrganizationContactInfo
                    profile={profile}
                    isEditing={isEditing}
                    editData={editData}
                    handleEditInputChange={handleEditInputChange}
                />

                <OrganizationDescription
                    profile={profile}
                    isEditing={isEditing}
                    editData={editData}
                    handleEditInputChange={handleEditInputChange}
                />
            </div>

            {/* Acciones de Edición */}
            {isEditing && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-8 py-4 border border-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                        className="flex-1 px-8 py-4 bg-blue-900 text-white rounded-2xl font-bold hover:bg-blue-950 transition-all shadow-lg hover:shadow-blue-900/30 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {updateProfileMutation.isPending ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Guardando...
                            </>
                        ) : 'Guardar Cambios'}
                    </button>
                </div>
            )}
        </div>
    );
}
