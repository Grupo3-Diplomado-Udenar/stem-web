import { PencilSquareIcon } from "../../../components/ui/Icons";
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
            <div className="text-center py-12">
                <p className="text-gray-600">Cargando perfil...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <p className="text-red-600">{errorMessage}</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No hay datos de perfil disponibles.</p>
            </div>
        );
    }

    if (isEditing) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Organización</label>
                            <input
                                type="text"
                                name="nombre"
                                value={editData.nombre || ''}
                                onChange={handleEditInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
                                <input
                                    type="text"
                                    name="sector"
                                    value={editData.sector || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                                <input
                                    type="text"
                                    name="ubicacion"
                                    value={editData.ubicacion || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea
                                name="descripcion"
                                value={editData.descripcion || ''}
                                onChange={handleEditInputChange}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            onClick={handleCancelEdit}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            disabled={updateProfileMutation.isPending}
                            className="flex-1 px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition disabled:opacity-50"
                        >
                            {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header del Perfil */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mi Perfil Organizacional</h2>
                <button onClick={handleEditClick} className="px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition flex items-center gap-2">
                    <PencilSquareIcon className="h-5 w-5" />
                    Editar Perfil
                </button>
            </div>

            {/* Tarjeta de Perfil */}
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                <div className="bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-4xl">

                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">{profile?.nombre || "No disponible"}</h3>
                            <p className="text-blue-100">{profile?.sector || "Sector no especificado"}</p>
                        </div>
                    </div>
                </div>

                {/* Información de Contacto */}
                <div className="p-8 border-b border-gray-200 grid grid-cols-2 gap-8">
                    <div className="flex items-center gap-3">
                        <span className="text-xl text-teal-600"></span>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-gray-900">{profile?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xl text-teal-600"></span>
                        <div>
                            <p className="text-sm text-gray-600">Ubicación</p>
                            <p className="text-gray-900">{profile?.ubicacion || "No disponible"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xl text-teal-600"></span>
                        <div>
                            <p className="text-sm text-gray-600">NIT</p>
                            <p className="text-gray-900">{profile?.nit}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xl text-teal-600"></span>
                        <div>
                            <p className="text-sm text-gray-600">Sector</p>
                            <p className="text-gray-900">{profile?.sector || "No especificado"}</p>
                        </div>
                    </div>
                </div>

                {/* Descripción de la Organización */}
                <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl"></span>
                        <h4 className="text-lg font-bold text-gray-900">Descripción de la Organización</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {profile?.descripcion || "Sin descripción proporcionada"}
                    </p>
                </div>
            </div>
        </div>
    );
}
