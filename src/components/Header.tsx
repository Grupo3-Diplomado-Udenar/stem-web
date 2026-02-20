import type { SVGProps } from "react";
import logo from "../assets/logo1.png";

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

type TabType = "explorar" | "perfil";
type OrgTabType = "vacantes" | "aplicantes" | "perfil";

type HeaderProps =
    | {
        variant: "minimal";
    }
    | {
        variant: "public";
        onLogin: () => void;
        onRegister: () => void;
    }
    | {
        variant: "student";
        activeTab: TabType;
        onTabChange: (tab: TabType) => void;
    }
    | {
        variant: "organization";
        activeTab: OrgTabType;
        onTabChange: (tab: OrgTabType) => void;
        onLogout: () => void;
    };

export default function Header(props: HeaderProps) {
    return (
        <header className="bg-white">
            <div className="mx-auto max-w-7xl ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-lg bg-white flex items-center justify-center">
                            <img
                                src={logo}
                                alt="Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">STEM LINK</h1>
                            <p className="text-xs text-gray-500">Portal de Prácticas Profesionales</p>
                        </div>
                        <div className="max-w-xl">
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Encuentra tu Práctica Profesional Ideal</h2>
                            <p className="text-xs text-gray-400 leading-relaxed">Conectamos talento STEM con las mejores oportunidades del sector productivo</p>
                        </div>

                    </div>

                    {props.variant === "minimal" ? null : props.variant === "public" ? (
                        <nav className="flex items-center gap-4">
                            <button
                                onClick={props.onLogin}
                                className="px-6 py-2 text-sm font-medium text-teal-700 rounded-lg border border-teal-700 hover:bg-teal-50 transition"
                            >
                                Iniciar Sesión
                            </button>
                            <button
                                onClick={props.onRegister}
                                className="px-6 py-2 text-sm font-medium text-white bg-teal-700 rounded-lg hover:bg-teal-800 transition"
                            >
                                Registrarse
                            </button>
                        </nav>
                    ) : props.variant === "student" ? (
                        <nav className="flex items-center gap-6">
                            <button
                                onClick={() => props.onTabChange("explorar")}
                                className={`px-4 py-2 text-sm font-medium rounded transition flex items-center gap-2 ${props.activeTab === "explorar"
                                    ? "bg-teal-700 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <MagnifyingGlassIcon className="h-5 w-5" />
                                Explorar
                            </button>
                            <button
                                onClick={() => props.onTabChange("perfil")}
                                className={`px-4 py-2 text-sm font-medium rounded transition flex items-center gap-2 ${props.activeTab === "perfil"
                                    ? "bg-teal-700 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                <UserIcon className="h-5 w-5" />
                                Mi Perfil
                            </button>
                        </nav>
                    ) : (
                        <nav className="flex items-center gap-6">
                            <button
                                onClick={() => props.onTabChange("vacantes")}
                                className={`px-4 py-2 text-sm font-medium rounded transition flex items-center gap-2 ${props.activeTab === "vacantes"
                                    ? "bg-teal-700 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                📋 Mis Vacantes
                            </button>
                            <button
                                onClick={() => props.onTabChange("aplicantes")}
                                className={`px-4 py-2 text-sm font-medium rounded transition flex items-center gap-2 ${props.activeTab === "aplicantes"
                                    ? "bg-teal-700 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                👥 Aplicantes
                            </button>
                            <button
                                onClick={() => props.onTabChange("perfil")}
                                className={`px-4 py-2 text-sm font-medium rounded transition flex items-center gap-2 ${props.activeTab === "perfil"
                                    ? "bg-teal-700 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                    }`}
                            >
                                🏢 Mi Perfil
                            </button>
                        </nav>
                    )}
                </div>
            </div>
        </header>
    );
}
