import { useState } from "react";
import AuthPage from "./AuthPage";
import EmpresasDestacadas from "../components/EmpresasDestacadas";
import FiltersPanel from "../components/FiltersPanel";
import OfertasRecientes from "../components/OfertasRecientes";
import Header from "../components/Header";
import PublicLayout from "../layouts/PublicLayout";
import { useDebouncedValue } from "../hook/useDebouncedValue";

interface LandingPageProps {
    onLoginSuccess?: (type: 'student' | 'organization') => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedValue(searchTerm, 300);

    const handleLoginClick = () => {
        setShowAuthModal(true);
    };

    const handleRegisterClick = () => {
        setShowAuthModal(true);
    };

    const handleCloseModal = () => {
        setShowAuthModal(false);
    };

    const handleAuthSuccess = (type: 'student' | 'organization') => {
        setShowAuthModal(false);
        if (onLoginSuccess) {
            onLoginSuccess(type);
        }
    };

    return (
        <PublicLayout
            header={
                <Header
                    variant="public"
                    onLogin={handleLoginClick}
                    onRegister={handleRegisterClick}
                />
            }
        >
                {/* Hero Section */}
                <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
                    <h2 className="text-3xl font-bold mb-2">Encuentra tu Práctica Profesional Ideal</h2>
                    <p className="mb-6 text-blue-100">Conectamos talento STEM con las mejores oportunidades del sector productivo</p>
                    <div className="flex gap-2">
                        <input
                            placeholder="Buscar por título, empresa o habilidad…"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="flex-1 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500"
                        />
                        <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition">
                            🔍 Buscar
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <FiltersPanel />

                {/* Empresas Destacadas */}
                <EmpresasDestacadas onVerTodas={() => {}} />

                {/* Ofertas Recientes */}
                <OfertasRecientes 
                    onVerDetalles={handleLoginClick}
                    onVerTodas={() => {}}
                    isAuthenticated={false}
                    searchTerm={debouncedSearch}
                />
            {/* Modal de Autenticación */}
            {showAuthModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="w-full max-w-md">
                        <AuthPage 
                            onLoginSuccess={handleAuthSuccess} 
                            onBackClick={handleCloseModal}
                            isModal={true}
                        />
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
