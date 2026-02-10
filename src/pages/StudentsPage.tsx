import type { SVGProps } from "react";
import { useEffect, useState } from "react";
import { logout } from "../api/auth";
import { universitiesApi } from "../api/universities";
import type { Career, University } from "../api/universities";
import EmpresasDestacadas from "../components/EmpresasDestacadas";
import OfertasRecientes from "../components/OfertasRecientes";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import Toast from "../components/Toast";
import MainLayout from "../layouts/MainLayout";
import { useProfileQuery } from "../hook/useProfile";
import {
    useAssignCareerMutation,
    useRemoveStudentCareerMutation,
    useStudentCareersQuery,
    useStudentQuery,
    useUpdateStudentCareerMutation,
    useUpdateStudentMutation,
} from "../hook/useStudents";

type TabType = "explorar" | "perfil";

interface StudentProfile {
    numero_identificacion: string;
    email: string;
    nombres: string;
    apellidos: string;
    tipo_identificacion: string;
    celular: string;
    ciudad: string;
    estado: boolean;
}

interface EducationEntry {
    id: string;
    universityId: string;
    universityName?: string;
    careerId: string;
    careerName?: string;
    level: string;
    status: string;
    semester: string;
    startDate: string;
    endDate: string;
    persisted?: boolean;
    originalCareerId?: string;
    originalStatus?: string;
    originalSemester?: string;
    originalStartDate?: string;
    originalEndDate?: string;
}

const PencilSquareIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.862 3.487a2.25 2.25 0 1 1 3.182 3.182L7.125 19.588 3 20.25l.662-4.125L16.862 3.487Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 15v3.75A2.25 2.25 0 0 1 17.25 21H5.25A2.25 2.25 0 0 1 3 18.75V6.75A2.25 2.25 0 0 1 5.25 4.5H9"
        />
    </svg>
);

const MagnifyingGlassIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 3 10.5a7.5 7.5 0 0 0 13.65 6.15Z"
        />
    </svg>
);

const UserIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
        />
    </svg>
);

const educationLevels = [
    { value: "TECHNICAL", label: "Técnico" },
    { value: "TECHNOLOGICAL", label: "Tecnológico" },
    { value: "UNDERGRADUATE", label: "Pregrado" },
    { value: "SPECIALIZATION", label: "Especialización" },
    { value: "MASTERS", label: "Maestría" },
    { value: "DOCTORATE", label: "Doctorado" },
];

const educationStatuses = [
    { value: "ACTIVO", label: "Activo" },
    { value: "GRADUADO", label: "Graduado" },
    { value: "RETIRADO", label: "Retirado" },
    { value: "SUSPENDIDO", label: "Suspendido" },
    { value: "EN_PAUSA", label: "En pausa" },
];

const createEntryId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createEmptyEntry = (): EducationEntry => ({
    id: createEntryId(),
    universityId: "",
    careerId: "",
    level: "",
    status: "",
    semester: "",
    startDate: "",
    endDate: "",
    persisted: false,
});

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("explorar");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<StudentProfile>>({});
    const [educationEntries, setEducationEntries] = useState<EducationEntry[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);
    const [careersByUniversity, setCareersByUniversity] = useState<Record<number, Career[]>>({});
    const [isLoadingUniversities, setIsLoadingUniversities] = useState(false);
    const [loadingCareersByUniversity, setLoadingCareersByUniversity] = useState<Record<number, boolean>>({});
    const [educationError, setEducationError] = useState<string | null>(null);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const profileQuery = useProfileQuery(true);
    const profile = profileQuery.data as StudentProfile | undefined;
    const profileErrorMessage = profileQuery.error instanceof Error
        ? profileQuery.error.message
        : "No pudimos cargar el perfil.";
    const studentId = profile?.numero_identificacion;
    const studentQuery = useStudentQuery(studentId);
    const studentCareersQuery = useStudentCareersQuery(studentId);
    const updateStudentMutation = useUpdateStudentMutation();
    const assignCareerMutation = useAssignCareerMutation();
    const updateStudentCareerMutation = useUpdateStudentCareerMutation();
    const removeStudentCareerMutation = useRemoveStudentCareerMutation();
    const student = studentQuery.data as StudentProfile | undefined;
    const studentErrorMessage = studentQuery.error instanceof Error
        ? studentQuery.error.message
        : "No pudimos cargar tu informacion.";

    const handleEditClick = () => {
        if (student) {
            setEditData({
                nombres: student.nombres,
                apellidos: student.apellidos,
                celular: student.celular,
                ciudad: student.ciudad,
                email: student.email,
            });
        }
        if (studentCareersQuery.data && studentCareersQuery.data.length > 0) {
            const entries = studentCareersQuery.data.map((record, index) => {
                const career = record.carrera;
                const university = career?.universidad ?? record.universidad;
                const universityId = career?.id_universidad ?? university?.id_universidad;
                const careerId = record.id_carrera ?? career?.id_carrera;
                return {
                    id: `${careerId ?? "career"}-${index}`,
                    universityId: universityId ? String(universityId) : "",
                    universityName: university?.nombre,
                    careerId: careerId ? String(careerId) : "",
                    careerName: career?.nombre,
                    level: career?.nivel ?? "",
                    status: record.estado ?? "",
                    semester: record.semestre_actual ? String(record.semestre_actual) : "",
                    startDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                    endDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
                    persisted: true,
                    originalCareerId: careerId ? String(careerId) : "",
                    originalStatus: record.estado ?? "",
                    originalSemester: record.semestre_actual ? String(record.semestre_actual) : "",
                    originalStartDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                    originalEndDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
                };
            });
            setEducationEntries(entries);
        } else {
            setEducationEntries([createEmptyEntry()]);
        }
        setIsEditing(true);
        setSaveMessage(null);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEducationChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEducationEntries(prev =>
            prev.map((entry, entryIndex) => {
                if (entryIndex !== index) return entry;
                const next = { ...entry, [name]: value } as EducationEntry;
                if (name === "universityId") {
                    next.careerId = "";
                    const universityId = Number(value);
                    if (!Number.isNaN(universityId)) {
                        loadCareersForUniversity(universityId);
                    }
                }
                if (name === "level") {
                    next.careerId = "";
                }
                return next;
            })
        );
    };

    const handleSaveProfile = async () => {
        if (!studentId) {
            setSaveMessage({ type: "error", text: "No encontramos tu identificacion." });
            return;
        }
        setEducationError(null);
        try {
            const existingCareerIds = new Set(
                (studentCareersQuery.data ?? [])
                    .map((record) => record.id_carrera ?? record.carrera?.id_carrera)
                    .filter((id): id is number => typeof id === "number")
            );
            const plannedCareerIds = new Set<number>();
            const filledEntries = educationEntries.filter((entry) =>
                Boolean(
                    entry.universityId ||
                    entry.careerId ||
                    entry.level ||
                    entry.status ||
                    entry.semester ||
                    entry.startDate ||
                    entry.endDate
                )
            );
            for (let index = 0; index < filledEntries.length; index += 1) {
                const entry = filledEntries[index];
                if (!entry.universityId) {
                    setEducationError(`Selecciona una universidad en la carrera ${index + 1}.`);
                    return;
                }
                const careerId = entry.careerId ? Number(entry.careerId) : undefined;
                if (!careerId || Number.isNaN(careerId)) {
                    setEducationError(`Selecciona una carrera valida en la carrera ${index + 1}.`);
                    return;
                }
                if (!entry.careerId || !entry.startDate || !entry.status) {
                    setEducationError(`Completa carrera, estado y fecha de inicio en la carrera ${index + 1}.`);
                    return;
                }
                const semester = entry.semester ? Number(entry.semester) : undefined;
                if (semester !== undefined && Number.isNaN(semester)) {
                    setEducationError(`El semestre actual debe ser un numero en la carrera ${index + 1}.`);
                    return;
                }
                if (entry.persisted && entry.originalCareerId) {
                    const originalCareerId = Number(entry.originalCareerId);
                    if (careerId !== originalCareerId) {
                        if (existingCareerIds.has(careerId) || plannedCareerIds.has(careerId)) {
                            setEducationError(`La carrera ${index + 1} esta duplicada.`);
                            return;
                        }
                        plannedCareerIds.add(careerId);
                        await removeStudentCareerMutation.mutateAsync({
                            studentId,
                            careerId: originalCareerId,
                        });
                        await assignCareerMutation.mutateAsync({
                            studentId,
                            dto: {
                                id_carrera: careerId,
                                estado: entry.status as
                                    | "ACTIVO"
                                    | "GRADUADO"
                                    | "RETIRADO"
                                    | "SUSPENDIDO"
                                    | "EN_PAUSA",
                                semestre_actual: semester ?? 1,
                                fecha_inicio: entry.startDate,
                                fecha_fin: entry.endDate || undefined,
                            },
                        });
                    } else {
                        const hasChanges =
                            entry.status !== entry.originalStatus ||
                            entry.semester !== entry.originalSemester ||
                            entry.startDate !== entry.originalStartDate ||
                            entry.endDate !== entry.originalEndDate;
                        if (hasChanges) {
                            await updateStudentCareerMutation.mutateAsync({
                                studentId,
                                careerId: originalCareerId,
                                dto: {
                                    estado: entry.status as
                                        | "ACTIVO"
                                        | "GRADUADO"
                                        | "RETIRADO"
                                        | "SUSPENDIDO"
                                        | "EN_PAUSA",
                                    semestre_actual: semester ?? 1,
                                    fecha_inicio: entry.startDate,
                                    fecha_fin: entry.endDate || undefined,
                                },
                            });
                        }
                    }
                    continue;
                }
                if (existingCareerIds.has(careerId) || plannedCareerIds.has(careerId)) {
                    setEducationError(`La carrera ${index + 1} esta duplicada.`);
                    return;
                }
                plannedCareerIds.add(careerId);
                await assignCareerMutation.mutateAsync({
                    studentId,
                    dto: {
                        id_carrera: careerId,
                        estado: entry.status as
                            | "ACTIVO"
                            | "GRADUADO"
                            | "RETIRADO"
                            | "SUSPENDIDO"
                            | "EN_PAUSA",
                        semestre_actual: semester ?? 1,
                        fecha_inicio: entry.startDate,
                        fecha_fin: entry.endDate || undefined,
                    },
                });
            }
            await updateStudentMutation.mutateAsync({ studentId, dto: editData });
            setIsEditing(false);
            setSaveMessage({ type: "success", text: "Perfil actualizado exitosamente" });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error: unknown) {
            setSaveMessage({
                type: "error",
                text: error instanceof Error ? error.message : "Error al actualizar el perfil",
            });
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSaveMessage(null);
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const loadCareersForUniversity = (universityId: number) => {
        if (!universityId) return;
        if (careersByUniversity[universityId]) return;
        if (loadingCareersByUniversity[universityId]) return;
        setLoadingCareersByUniversity(prev => ({ ...prev, [universityId]: true }));
        setEducationError(null);
        universitiesApi
            .careersByUniversity(universityId)
            .then((data) => {
                setCareersByUniversity(prev => ({ ...prev, [universityId]: data ?? [] }));
            })
            .catch((error: unknown) => {
                setEducationError(error instanceof Error ? error.message : "No pudimos cargar carreras.");
            })
            .finally(() => {
                setLoadingCareersByUniversity(prev => ({ ...prev, [universityId]: false }));
            });
    };

    useEffect(() => {
        let isActive = true;
        setIsLoadingUniversities(true);
        setEducationError(null);
        universitiesApi
            .list()
            .then((data) => {
                if (isActive) {
                    setUniversities(data ?? []);
                }
            })
            .catch((error: unknown) => {
                if (isActive) {
                    setEducationError(error instanceof Error ? error.message : "No pudimos cargar universidades.");
                }
            })
            .finally(() => {
                if (isActive) {
                    setIsLoadingUniversities(false);
                }
            });
        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        if (!studentCareersQuery.data || isEditing) return;
        const entries = studentCareersQuery.data.map((record, index) => {
            const career = record.carrera;
            const university = career?.universidad ?? record.universidad;
            const universityId = career?.id_universidad ?? university?.id_universidad;
            const careerId = record.id_carrera ?? career?.id_carrera;
            if (universityId) {
                loadCareersForUniversity(universityId);
            }
            return {
                id: `${careerId ?? "career"}-${index}`,
                universityId: universityId ? String(universityId) : "",
                universityName: university?.nombre,
                careerId: careerId ? String(careerId) : "",
                careerName: career?.nombre,
                level: career?.nivel ?? "",
                status: record.estado ?? "",
                semester: record.semestre_actual ? String(record.semestre_actual) : "",
                startDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                endDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
                persisted: true,
                originalCareerId: careerId ? String(careerId) : "",
                originalStatus: record.estado ?? "",
                originalSemester: record.semestre_actual ? String(record.semestre_actual) : "",
                originalStartDate: record.fecha_inicio ? record.fecha_inicio.slice(0, 10) : "",
                originalEndDate: record.fecha_fin ? record.fecha_fin.slice(0, 10) : "",
            };
        });
        setEducationEntries(entries.length > 0 ? entries : []);
    }, [studentCareersQuery.data, isEditing]);

    const sidebarItems = [
        { id: "explorar", label: "Explorar", icon: <MagnifyingGlassIcon className="h-5 w-5" /> },
        { id: "perfil", label: "Mi Perfil", icon: <UserIcon className="h-5 w-5" /> },
    ];

    const getCareersForEntry = (entry: EducationEntry) => {
        const universityId = Number(entry.universityId);
        if (Number.isNaN(universityId)) return [] as Career[];
        return careersByUniversity[universityId] ?? [];
    };

    const getFilteredCareersForEntry = (entry: EducationEntry) => {
        const careers = getCareersForEntry(entry);
        if (!entry.level) return careers;
        const levelFiltered = careers.filter((career) => career.nivel === entry.level);
        return levelFiltered.length === 0 ? careers : levelFiltered;
    };

    const resolveUniversityName = (entry: EducationEntry) => {
        if (entry.universityName) return entry.universityName;
        const universityId = Number(entry.universityId);
        return universities.find((university) => university.id_universidad === universityId)?.nombre;
    };

    const resolveCareerName = (entry: EducationEntry) => {
        if (entry.careerName) return entry.careerName;
        const careerId = Number(entry.careerId);
        const careers = getCareersForEntry(entry);
        return careers.find((career) => career.id_carrera === careerId)?.nombre;
    };

    const resolveLevelLabel = (entry: EducationEntry) =>
        educationLevels.find((level) => level.value === entry.level)?.label;

    const addEducationEntry = () => {
        setEducationEntries(prev => [...prev, createEmptyEntry()]);
    };

    const removeEducationEntry = (entryId: string) => {
        setEducationEntries(prev => {
            const next = prev.filter((entry) => entry.id !== entryId);
            return next.length > 0 ? next : [createEmptyEntry()];
        });
    };

    const handleRemoveCareer = async (entry: EducationEntry) => {
        if (!studentId) return;
        if (!entry.persisted || !entry.originalCareerId) {
            removeEducationEntry(entry.id);
            return;
        }
        const careerId = Number(entry.originalCareerId);
        if (Number.isNaN(careerId)) {
            removeEducationEntry(entry.id);
            return;
        }
        try {
            await removeStudentCareerMutation.mutateAsync({ studentId, careerId });
            removeEducationEntry(entry.id);
        } catch (error: unknown) {
            setEducationError(error instanceof Error ? error.message : "No pudimos eliminar la carrera.");
        }
    };

    return (
        <MainLayout
            header={<Header variant="minimal" />}
            sidebar={
                <SidebarMenu
                    title="Menu"
                    items={sidebarItems}
                    activeId={activeTab}
                    onChange={(tab) => setActiveTab(tab as TabType)}
                    onLogout={handleLogout}
                />
            }
        >
            {saveMessage ? (
                <Toast
                    message={saveMessage.text}
                    type={saveMessage.type}
                    position="top-center"
                />
            ) : null}
            {activeTab === "explorar" && (
                <div className="space-y-8">
                        {/* Hero Section */}
                        <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
                            <h2 className="text-3xl font-bold mb-2">Encuentra tu Práctica Profesional Ideal</h2>
                            <p className="text-blue-100">Conectamos talento STEM con las mejores oportunidades del sector productivo</p>
                        </div>

                        {/* Filtros */}
                        <div className="rounded-xl border bg-white p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-xl"></span>
                                <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                                    <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white cursor-pointer hover:border-gray-400">
                                        <option>Todas las Carreras</option>
                                        <option>Ingeniería de Sistemas</option>
                                        <option>Ingeniería de Software</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                                    <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white cursor-pointer hover:border-gray-400">
                                        <option>Todas las Ubicaciones</option>
                                        <option>Bogotá</option>
                                        <option>Medellín</option>
                                        <option>Cali</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contrato</label>
                                    <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white cursor-pointer hover:border-gray-400">
                                        <option>Todos los Tipos</option>
                                        <option>Práctica Profesional</option>
                                        <option>Pasantía</option>
                                        <option>Contrato Temporal</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Empresas Destacadas */}
                        <EmpresasDestacadas onVerTodas={() => {}} />

                        {/* Ofertas Recientes */}
                    <OfertasRecientes 
                        onVerDetalles={(oferta) => {
                            console.log("Ver detalles de oferta:", oferta);
                        }}
                        onVerTodas={() => {}}
                        isAuthenticated={true}
                        searchTerm=""
                    />
                </div>
            )}

            {activeTab === "perfil" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {profileQuery.isLoading || studentQuery.isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Cargando perfil...</p>
                        </div>
                    ) : profileQuery.isError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{profileErrorMessage}</p>
                        </div>
                    ) : studentQuery.isError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{studentErrorMessage}</p>
                        </div>
                    ) : !student ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No hay datos de perfil disponibles.</p>
                        </div>
                    ) : (
                        <>
                                {/* Header del Perfil */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Mi Perfil Profesional</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={handleEditClick}
                                            className="px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition flex items-center gap-2"
                                        >
                                            <PencilSquareIcon className="h-5 w-5" />
                                            Editar Perfil
                                        </button>
                                    ) : null}
                                </div>

                                {/* Tarjeta de Perfil */}
                                <div className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                                    <div className="bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-full bg-blue-800 flex items-center justify-center text-4xl">
                                                
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
                                    {/* Información de Contacto */}
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

                    
                                    {/* Formación Académica */}
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-xl"></span>
                                            <h4 className="text-lg font-bold text-gray-900">Formación Académica</h4>
                                        </div>
                                        {isEditing ? (
                                            <div className="space-y-6">
                                                {educationEntries.map((entry, index) => {
                                                    const careers = getFilteredCareersForEntry(entry);
                                                    const universityId = Number(entry.universityId);
                                                    const isLoadingCareers =
                                                        !Number.isNaN(universityId) &&
                                                        loadingCareersByUniversity[universityId];
                                                    const removeLabel = entry.persisted ? "Eliminar" : "Quitar";
                                                    return (
                                                        <div key={entry.id} className="rounded-xl border border-gray-200 p-4">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <h5 className="text-sm font-semibold text-gray-700">
                                                                    Carrera {index + 1}
                                                                </h5>
                                                                {educationEntries.length > 1 || entry.persisted ? (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveCareer(entry)}
                                                                        className="text-sm text-red-600 hover:text-red-700"
                                                                    >
                                                                        {removeLabel}
                                                                    </button>
                                                                ) : null}
                                                            </div>
                                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Universidad *</label>
                                                                    <select
                                                                        name="universityId"
                                                                        value={entry.universityId}
                                                                        onChange={(e) => handleEducationChange(index, e)}
                                                                        disabled={isLoadingUniversities}
                                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                                    >
                                                                        <option value="">
                                                                            {isLoadingUniversities
                                                                                ? "Cargando universidades..."
                                                                                : "Selecciona universidad"}
                                                                        </option>
                                                                        {universities.map((university) => (
                                                                            <option
                                                                                key={university.id_universidad}
                                                                                value={university.id_universidad}
                                                                            >
                                                                                {university.nombre}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nivel</label>
                                                                    <select
                                                                        name="level"
                                                                        value={entry.level}
                                                                        onChange={(e) => handleEducationChange(index, e)}
                                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                                    >
                                                                        <option value="">Selecciona nivel</option>
                                                                        {educationLevels.map((level) => (
                                                                            <option key={level.value} value={level.value}>
                                                                                {level.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Carrera *</label>
                                                                    <select
                                                                        name="careerId"
                                                                        value={entry.careerId}
                                                                        onChange={(e) => handleEducationChange(index, e)}
                                                                        disabled={!entry.universityId || Boolean(isLoadingCareers)}
                                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                                    >
                                                                        <option value="">
                                                                            {!entry.universityId
                                                                                ? "Selecciona universidad primero"
                                                                                : isLoadingCareers
                                                                                ? "Cargando carreras..."
                                                                                : "Selecciona carrera"}
                                                                        </option>
                                                                        {entry.universityId && !isLoadingCareers && careers.length === 0 ? (
                                                                            <option value="" disabled>
                                                                                No hay carreras disponibles
                                                                            </option>
                                                                        ) : null}
                                                                        {careers.map((career) => (
                                                                            <option key={career.id_carrera} value={career.id_carrera}>
                                                                                {career.nombre}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                                                                    <select
                                                                        name="status"
                                                                        value={entry.status}
                                                                        onChange={(e) => handleEducationChange(index, e)}
                                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                                    >
                                                                        <option value="">Selecciona estado</option>
                                                                        {educationStatuses.map((status) => (
                                                                            <option key={status.value} value={status.value}>
                                                                                {status.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Semestre actual *</label>
                                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        name="semester"
                                                                        value={entry.semester}
                                                                        onChange={(e) => handleEducationChange(index, e)}
                                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de inicio *</label>
                                                                    <input
                                                                        type="date"
                                                                        name="startDate"
                                                                        value={entry.startDate}
                                                                        onChange={(e) => handleEducationChange(index, e)}
                                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de finalización</label>
                                                                    <input
                                                                        type="date"
                                                                        name="endDate"
                                                                        value={entry.endDate}
                                                                        onChange={(e) => handleEducationChange(index, e)}
                                                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        type="button"
                                                        onClick={addEducationEntry}
                                                        className="text-sm font-medium text-teal-700 hover:text-teal-800"
                                                    >
                                                        + Agregar carrera
                                                    </button>
                                                </div>
                                                {educationError ? (
                                                    <p className="text-sm text-red-600">{educationError}</p>
                                                ) : null}
                                            </div>
                                        ) : educationEntries.length === 0 ? (
                                            <p className="text-sm text-gray-600">Sin formación académica registrada.</p>
                                        ) : (
                                            <div className="space-y-4">
                                                {educationEntries.map((entry) => {
                                                    const universityName = resolveUniversityName(entry);
                                                    const careerName = resolveCareerName(entry);
                                                    const levelLabel = resolveLevelLabel(entry);
                                                    const statusLabel = educationStatuses.find(
                                                        (status) => status.value === entry.status
                                                    )?.label;
                                                    return (
                                                        <div key={entry.id} className="border-l-4 border-teal-600 pl-6 pb-4">
                                                            <h5 className="text-lg font-bold text-gray-900 mb-1">
                                                                {careerName || "Carrera no definida"}
                                                            </h5>
                                                            <p className="text-sm text-gray-600 mb-2">
                                                                {universityName || "Universidad no definida"}
                                                            </p>
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-sm text-gray-600">
                                                                    {entry.startDate || "Sin fecha"} - {entry.endDate || "Actual"}
                                                                </p>
                                                                {levelLabel ? (
                                                                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                                                                        {levelLabel}
                                                                    </span>
                                                                ) : null}
                                                            </div>
                                                            {entry.semester ? (
                                                                <p className="text-sm text-gray-600 mt-2">
                                                                    Semestre actual: {entry.semester}
                                                                </p>
                                                            ) : null}
                                                            {statusLabel ? (
                                                                <p className="text-sm text-gray-600 mt-2">
                                                                    Estado: {statusLabel}
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {isEditing ? (
                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            onClick={handleCancel}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={
                                                updateStudentMutation.isPending ||
                                                assignCareerMutation.isPending ||
                                                updateStudentCareerMutation.isPending ||
                                                removeStudentCareerMutation.isPending
                                            }
                                            className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition disabled:opacity-50"
                                        >
                                            {updateStudentMutation.isPending ||
                                            assignCareerMutation.isPending ||
                                            updateStudentCareerMutation.isPending ||
                                            removeStudentCareerMutation.isPending
                                                ? "Guardando..."
                                                : "Guardar Cambios"}
                                        </button>
                                    </div>
                                ) : null}
                            </>
                        )}
                    </div>
            )}
        </MainLayout>
    );
}


