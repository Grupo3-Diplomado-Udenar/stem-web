import type { OrganizationProfile } from "../types/organization.types";

interface OrganizationCardProps {
    profile: OrganizationProfile;
    isEditing: boolean;
    editData: Partial<OrganizationProfile>;
    handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function OrganizationCard({
    profile,
    isEditing,
    editData,
    handleEditInputChange
}: OrganizationCardProps) {
    return (
        <div className="bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-4xl overflow-hidden shadow-xl">
                    {profile.logo_url ? (
                        <img src={profile.logo_url} alt={profile.nombre} className="w-full h-full object-cover" />
                    ) : (
                        <span>🏢</span>
                    )}
                </div>
                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-3">
                            <input
                                type="text"
                                name="nombre"
                                value={editData.nombre || ""}
                                onChange={handleEditInputChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                                placeholder="Nombre de la Organización"
                            />
                            <input
                                type="text"
                                name="sector"
                                value={editData.sector || ""}
                                onChange={handleEditInputChange}
                                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition"
                                placeholder="Sector (ej: Tecnología)"
                            />
                        </div>
                    ) : (
                        <>
                            <h3 className="text-3xl font-bold tracking-tight">{profile.nombre}</h3>
                            <p className="text-blue-100 text-lg mt-1 opacity-90">{profile.sector || "Sector no especificado"}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
