import type { StudentProfile } from "../types/student.types";

interface ContactInfoProps {
    student: StudentProfile;
    isEditing: boolean;
    editData: Partial<StudentProfile>;
    handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ContactInfo({
    student,
    isEditing,
    editData,
    handleEditInputChange
}: ContactInfoProps) {
    return (
        <div className="p-8 border-b border-gray-200 grid grid-cols-2 gap-8">
            <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#014766]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                    <p className="text-sm text-gray-600">Email</p>
                    {isEditing ? (
                        <input
                            type="email"
                            name="email"
                            value={editData.email || ""}
                            onChange={handleEditInputChange}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />
                    ) : (
                        <p className="text-gray-900">{student.email}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#014766]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                    <p className="text-sm text-gray-600">Teléfono</p>
                    {isEditing ? (
                        <input
                            type="tel"
                            name="celular"
                            value={editData.celular || ""}
                            onChange={handleEditInputChange}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />
                    ) : (
                        <p className="text-gray-900">{student.celular || "No disponible"}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#014766]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                    <p className="text-sm text-gray-600">Ubicación</p>
                    {isEditing ? (
                        <input
                            type="text"
                            name="ciudad"
                            value={editData.ciudad || ""}
                            onChange={handleEditInputChange}
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />
                    ) : (
                        <p className="text-gray-900">{student.ciudad || "No disponible"}</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-[#014766]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                    <p className="text-sm text-gray-600">Identificación</p>
                    <p className="text-gray-900">{student.tipo_identificacion} {student.numero_identificacion}</p>
                </div>
            </div>
        </div>
    );
}
