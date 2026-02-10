import type { SVGProps } from "react";
import { useState } from "react";
import { logout } from "../api/auth";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import Toast from "../components/Toast";
import MainLayout from "../layouts/MainLayout";
import { useProfileQuery, useUpdateProfileMutation } from "../hook/useProfile";

type OrgTabType = "vacantes" | "aplicantes" | "perfil";

interface Oferta {
    titulo: string;
    descripcion: string;
    tipo: string;
    ubicacion: string;
    duracion: string;
    salario: string;
    habilidades: string[];
}

interface OrganizationProfile {
    id_organizacion: string;
    nit: string;
    nombre: string;
    email: string;
    sector: string;
    descripcion: string;
    logo_url: string;
    ubicacion: string;
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

const BriefcaseIcon = (props: SVGProps<SVGSVGElement>) => (
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
            d="M20.25 7.5H3.75a2.25 2.25 0 0 0-2.25 2.25v7.5a2.25 2.25 0 0 0 2.25 2.25h16.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 7.5v-1.5A2.25 2.25 0 0 0 13.5 3.75h-3A2.25 2.25 0 0 0 8.25 6v1.5"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M1.5 12h21"
        />
    </svg>
);

const UsersIcon = (props: SVGProps<SVGSVGElement>) => (
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
            d="M18 18.75a3.75 3.75 0 0 0-3.75-3.75h-4.5A3.75 3.75 0 0 0 6 18.75"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 18.75a3.75 3.75 0 0 0-3-3.675"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 6.75a2.625 2.625 0 1 1-2.406 3.675"
        />
    </svg>
);

const BuildingOfficeIcon = (props: SVGProps<SVGSVGElement>) => (
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
            d="M3.75 21h16.5"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 21V5.25A2.25 2.25 0 0 1 8.25 3h7.5A2.25 2.25 0 0 1 18 5.25V21"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 7.5h.008v.008H9V7.5ZM12 7.5h.008v.008H12V7.5ZM15 7.5h.008v.008H15V7.5ZM9 10.5h.008v.008H9v-.008ZM12 10.5h.008v.008H12v-.008ZM15 10.5h.008v.008H15v-.008ZM9 13.5h.008v.008H9V13.5ZM12 13.5h.008v.008H12V13.5ZM15 13.5h.008v.008H15V13.5Z"
        />
    </svg>
);

const EyeIcon = (props: SVGProps<SVGSVGElement>) => (
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
            d="M2.25 12c2.25-4.5 5.625-6.75 9.75-6.75S19.5 7.5 21.75 12c-2.25 4.5-5.625 6.75-9.75 6.75S4.5 16.5 2.25 12Z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
    </svg>
);

export default function OrganizationPage() {
    const [activeTab, setActiveTab] = useState<OrgTabType>("vacantes");
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<OrganizationProfile>>({});
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [oferta, setOferta] = useState<Oferta>({
        titulo: "",
        descripcion: "",
        tipo: "Práctica Profesional",
        ubicacion: "",
        duracion: "",
        salario: "",
        habilidades: [],
    });
    const [skillInput, setSkillInput] = useState("");

    const profileQuery = useProfileQuery(activeTab === "perfil");
    const updateProfileMutation = useUpdateProfileMutation();
    const profile = profileQuery.data as OrganizationProfile | undefined;
    const profileErrorMessage = profileQuery.error instanceof Error
        ? profileQuery.error.message
        : "No pudimos cargar el perfil.";

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const handleEditClick = () => {
        if (profile) {
            setEditData({
                nombre: profile.nombre,
                sector: profile.sector,
                descripcion: profile.descripcion,
                ubicacion: profile.ubicacion,
            });
        }
        setIsEditing(true);
        setSaveMessage(null);
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = () => {
        updateProfileMutation.mutate(editData, {
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

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSaveMessage(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOferta(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addSkill = () => {
        if (skillInput.trim() && !oferta.habilidades.includes(skillInput)) {
            setOferta(prev => ({
                ...prev,
                habilidades: [...prev.habilidades, skillInput]
            }));
            setSkillInput("");
        }
    };

    const removeSkill = (skill: string) => {
        setOferta(prev => ({
            ...prev,
            habilidades: prev.habilidades.filter(s => s !== skill)
        }));
    };

    const handlePublish = () => {
        console.log("Oferta publicada:", oferta);
        alert("Oferta publicada exitosamente");
        setOferta({
            titulo: "",
            descripcion: "",
            tipo: "Práctica Profesional",
            ubicacion: "",
            duracion: "",
            salario: "",
            habilidades: [],
        });
        setShowForm(false);
    };

    const sidebarItems = [
        { id: "vacantes", label: "Mis Vacantes", icon: <BriefcaseIcon className="h-5 w-5" /> },
        { id: "aplicantes", label: "Aplicantes", icon: <UsersIcon className="h-5 w-5" /> },
        { id: "perfil", label: "Mi Perfil", icon: <BuildingOfficeIcon className="h-5 w-5" /> },
    ];

    return (
        <MainLayout
            header={<Header variant="minimal" />}
            sidebar={
                <SidebarMenu
                    title="Menu"
                    items={sidebarItems}
                    activeId={activeTab}
                    onChange={(tab) => setActiveTab(tab as OrgTabType)}
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
            {activeTab === "vacantes" && (
                <div>
                        {!showForm ? (
                            <div className="text-center py-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Gestiona tus Vacantes</h2>
                                <p className="text-gray-600 mb-8">Crea y publica nuevas oportunidades para atraer talento STEM</p>
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="px-8 py-3 bg-teal-700 text-white rounded-lg font-medium hover:bg-teal-800 transition"
                                >
                                    + Crear Nueva Vacante
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-8">
                                {/* Formulario */}
                                <div className="bg-white rounded-xl p-6 border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        📋 Crear Nueva Vacante
                                    </h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-teal-600 mb-2">Título del Puesto *</label>
                                            <input
                                                type="text"
                                                name="titulo"
                                                value={oferta.titulo}
                                                onChange={handleInputChange}
                                                placeholder="ej: Desarrollador"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-teal-600 mb-2">Descripción del Puesto *</label>
                                            <textarea
                                                name="descripcion"
                                                value={oferta.descripcion}
                                                onChange={handleInputChange}
                                                placeholder="Describe el puesto y responsabilidades"
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">{oferta.descripcion.length} caracteres</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-teal-600 mb-2">Tipo de Contrato *</label>
                                            <select
                                                name="tipo"
                                                value={oferta.tipo}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                                            >
                                                <option>Práctica Profesional</option>
                                                <option>Pasantía</option>
                                                <option>Contrato Temporal</option>
                                                <option>Contrato Permanente</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-teal-600 mb-2">Ubicación *</label>
                                            <input
                                                type="text"
                                                name="ubicacion"
                                                value={oferta.ubicacion}
                                                onChange={handleInputChange}
                                                placeholder="ej: Pasto, Nariño"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Duración (Opcional)</label>
                                            <input
                                                type="text"
                                                name="duracion"
                                                value={oferta.duracion}
                                                onChange={handleInputChange}
                                                placeholder="ej: 6 meses"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Salario/Auxilio (Opcional)</label>
                                            <input
                                                type="text"
                                                name="salario"
                                                value={oferta.salario}
                                                onChange={handleInputChange}
                                                placeholder="ej: 3456"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-teal-600 mb-2">Habilidades Requeridas *</label>
                                            <div className="flex gap-2 mb-3">
                                                <select
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white"
                                                >
                                                    <option value="">Selecciona habilidades</option>
                                                    <option value="React">React</option>
                                                    <option value="Node.js">Node.js</option>
                                                    <option value="Python">Python</option>
                                                    <option value="Django">Django</option>
                                                    <option value="SQL">SQL</option>
                                                    <option value="PostgreSQL">PostgreSQL</option>
                                                    <option value="JavaScript">JavaScript</option>
                                                    <option value="TypeScript">TypeScript</option>
                                                </select>
                                                <button
                                                    onClick={addSkill}
                                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                                                >
                                                    + Agregar
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {oferta.habilidades.map((skill) => (
                                                    <span key={skill} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        {skill}
                                                        <button
                                                            onClick={() => removeSkill(skill)}
                                                            className="ml-2 font-bold hover:text-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-8">
                                        <button
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                            Ocultar
                                        </button>
                                        <button
                                            onClick={handlePublish}
                                            className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                                        >
                                            ✈️ Publicar Oferta
                                        </button>
                                    </div>
                                </div>

                                {/* Vista Previa */}
                                <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        Vista Previa para Estudiantes
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">Así verán los estudiantes tu oferta publicada</p>

                                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="text-4xl"></div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-gray-900 mb-1">
                                                    {oferta.titulo || "Título del Puesto"}
                                                </h4>
                                                <p className="text-sm text-gray-600 mb-2">Tu Empresa</p>
                                                <div className="space-y-1 text-sm text-gray-600 mb-3">
                                                    {oferta.ubicacion && <p> {oferta.ubicacion}</p>}
                                                    {oferta.tipo && <p>{oferta.tipo}</p>}
                                                    {oferta.duracion && <p> Duración: {oferta.duracion}</p>}
                                                    {oferta.salario && <p>{oferta.salario}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {oferta.descripcion && (
                                            <>
                                                <h5 className="font-bold text-gray-900 mb-2">Descripción</h5>
                                                <p className="text-sm text-gray-600 mb-4">{oferta.descripcion}</p>
                                            </>
                                        )}

                                        {oferta.habilidades.length > 0 && (
                                            <>
                                                <h5 className="font-bold text-gray-900 mb-2">Habilidades Requeridas</h5>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {oferta.habilidades.map((skill) => (
                                                        <span key={skill} className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-700">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        <button className="w-full px-4 py-2 bg-blue-900 text-white rounded-lg font-medium hover:bg-blue-950 transition">
                                            Postularme a esta oferta
                                        </button>
                                    </div>

                                    <p className="text-xs text-blue-600 mt-4">
                                         Esta es una vista previa de cómo los estudiantes verán tu oferta
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
            )}

            {activeTab === "aplicantes" && (
                <div className="text-center py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Aplicantes</h2>
                    <p className="text-gray-600">No hay aplicantes aun. Publica una vacante para empezar a recibir candidatos.</p>
                </div>
            )}

            {activeTab === "perfil" && (
                <div className="space-y-6 max-w-4xl mx-auto">
                    {profileQuery.isLoading ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">Cargando perfil...</p>
                        </div>
                    ) : profileQuery.isError ? (
                        <div className="text-center py-12">
                            <p className="text-red-600">{profileErrorMessage}</p>
                        </div>
                    ) : !profile ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600">No hay datos de perfil disponibles.</p>
                        </div>
                    ) : isEditing ? (
                        <>
                                {/* Formulario de Edición */}
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
                            </>
                    ) : (
                        <>
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

                            </>
                        )}
                </div>
            )}
        </MainLayout>
    );
}
