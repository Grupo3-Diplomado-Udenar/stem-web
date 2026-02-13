import type { StudentProfile } from "../types/student.types";

interface ProfileCardProps {
    student: StudentProfile;
    isEditing: boolean;
    editData: Partial<StudentProfile>;
    handleEditInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileCard({
    student,
    isEditing,
    editData,
    handleEditInputChange
}: ProfileCardProps) {
    return (
        <div className="bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-4xl">
                    {/* Placeholder for avatar */}
                </div>
                <div>
                    {isEditing ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <input
                                type="text"
                                name="nombres"
                                value={editData.nombres || ""}
                                onChange={handleEditInputChange}
                                className="w-full rounded-lg border border-white/40 bg-white/20 px-3 py-2 text-sm text-white placeholder-white/80 focus:outline-none"
                                placeholder="Nombres"
                            />
                            <input
                                type="text"
                                name="apellidos"
                                value={editData.apellidos || ""}
                                onChange={handleEditInputChange}
                                className="w-full rounded-lg border border-white/40 bg-white/20 px-3 py-2 text-sm text-white placeholder-white/80 focus:outline-none"
                                placeholder="Apellidos"
                            />
                        </div>
                    ) : (
                        <h3 className="text-2xl font-bold">
                            {student.nombres} {student.apellidos}
                        </h3>
                    )}
                    <p className="text-blue-100">Estudiante STEM - Universidad de Nariño</p>
                </div>
            </div>
        </div>
    );
}
