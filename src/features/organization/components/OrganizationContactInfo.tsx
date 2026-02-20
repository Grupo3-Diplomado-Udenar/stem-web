import type { OrganizationProfile } from "../types/organization.types";

interface OrganizationContactInfoProps {
    profile: OrganizationProfile;
    isEditing: boolean;
    editData: Partial<OrganizationProfile>;
    handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function OrganizationContactInfo({
    profile,
    isEditing,
    editData,
    handleEditInputChange
}: OrganizationContactInfoProps) {
    return (
        <div className="p-8 border-b border-gray-100 bg-white">
            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Información General</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Email Corporativo</p>
                        <p className="text-gray-900 font-medium break-all">{profile.email}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase">Ubicación Principal</p>
                        {isEditing ? (
                            <input
                                type="text"
                                name="ubicacion"
                                value={editData.ubicacion || ""}
                                onChange={handleEditInputChange}
                                className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                                placeholder="Ciudad, País"
                            />
                        ) : (
                            <p className="text-gray-900 font-medium">{profile.ubicacion || "No disponible"}</p>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">NIT</p>
                        <p className="text-gray-900 font-medium">{profile.nit}</p>
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">Estado Cuenta</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${profile.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {profile.estado ? 'Activa' : 'Inactiva'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
