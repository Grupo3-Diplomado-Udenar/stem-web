import type { OrganizationProfile } from "../types/organization.types";

interface OrganizationDescriptionProps {
    profile: OrganizationProfile;
    isEditing: boolean;
    editData: Partial<OrganizationProfile>;
    handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function OrganizationDescription({
    profile,
    isEditing,
    editData,
    handleEditInputChange
}: OrganizationDescriptionProps) {
    return (
        <div className="p-8">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Sobre la Organización</h4>
            {isEditing ? (
                <textarea
                    name="descripcion"
                    value={editData.descripcion || ""}
                    onChange={handleEditInputChange}
                    rows={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none"
                    placeholder="Describe los objetivos, cultura y lo que busca tu organización..."
                />
            ) : (
                <p className="text-gray-700 leading-relaxed text-lg italic bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    "{profile.descripcion || "Sin descripción proporcionada"}"
                </p>
            )}
        </div>
    );
}
