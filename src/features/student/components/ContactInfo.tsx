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
                <span className="text-xl text-teal-600"></span>
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
                <span className="text-xl text-teal-600"></span>
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
                <span className="text-xl text-teal-600"></span>
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
                <span className="text-xl text-teal-600"></span>
                <div>
                    <p className="text-sm text-gray-600">Identificación</p>
                    <p className="text-gray-900">{student.tipo_identificacion} {student.numero_identificacion}</p>
                </div>
            </div>
        </div>
    );
}
