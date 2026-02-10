import type { SVGProps } from "react";
import { useState } from "react";
import { logout } from "../api/auth";
import EmpresasDestacadas from "../components/EmpresasDestacadas";
import OfertasRecientes from "../components/OfertasRecientes";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import Toast from "../components/Toast";
import MainLayout from "../layouts/MainLayout";
import { useProfileQuery } from "../hook/useProfile";
import { useStudentQuery, useUpdateStudentMutation } from "../hook/useStudents";

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

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("explorar");
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<StudentProfile>>({});
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const profileQuery = useProfileQuery(true);
    const profile = profileQuery.data as StudentProfile | undefined;
    const profileErrorMessage = profileQuery.error instanceof Error
        ? profileQuery.error.message
        : "No pudimos cargar el perfil.";
    const studentId = profile?.numero_identificacion;
    const studentQuery = useStudentQuery(studentId);
    const updateStudentMutation = useUpdateStudentMutation();
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

    const handleSaveProfile = () => {
        if (!studentId) {
            setSaveMessage({ type: "error", text: "No encontramos tu identificacion." });
            return;
        }
        updateStudentMutation.mutate({ studentId, dto: editData }, {
            onSuccess: () => {
                setIsEditing(false);
                setSaveMessage({ type: "success", text: "Perfil actualizado exitosamente" });
                setTimeout(() => setSaveMessage(null), 3000);
            },
            onError: (error: unknown) => {
                setSaveMessage({
                    type: "error",
                    text: error instanceof Error ? error.message : "Error al actualizar el perfil",
                });
            },
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setSaveMessage(null);
    };

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const sidebarItems = [
        { id: "explorar", label: "Explorar", icon: <MagnifyingGlassIcon className="h-5 w-5" /> },
        { id: "perfil", label: "Mi Perfil", icon: <UserIcon className="h-5 w-5" /> },
    ];

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

                            {/* Resumen Profesional */}
                            <div className="p-8 border-b border-gray-200">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl"></span>
                                    <h4 className="text-lg font-bold text-gray-900">Resumen Profesional</h4>
                                </div>
                                <p className="text-gray-700 leading-relaxed">
                                    Estudiante de Ingeniería de Sistemas de la Universidad de Nariño, apasionado por el desarrollo web y análisis de datos. Busco oportunidades de práctica profesional para aplicar mis conocimientos en proyectos reales.
                                </p>
                            </div>

                                    {/* Formación Académica */}
                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-6">
                                            <span className="text-xl"></span>
                                            <h4 className="text-lg font-bold text-gray-900">Formación Académica</h4>
                                        </div>
                                        <div className="border-l-4 border-teal-600 pl-6 pb-6">
                                            <h5 className="text-lg font-bold text-gray-900 mb-1">Ingeniería de Sistemas</h5>
                                            <p className="text-sm text-gray-600 mb-2">Universidad de Nariño</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600">2020 - 2025 (Esperado)</p>
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                                                    En curso
                                                </span>
                                            </div>
                                        </div>
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
                                            disabled={updateStudentMutation.isPending}
                                            className="px-6 py-3 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition disabled:opacity-50"
                                        >
                                            {updateStudentMutation.isPending ? "Guardando..." : "Guardar Cambios"}
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


