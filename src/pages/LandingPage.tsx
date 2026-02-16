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
    const [filterOrganization, setFilterOrganization] = useState("");
    const [filterTitle, setFilterTitle] = useState("");
    const [sortByDate, setSortByDate] = useState("");
    const debouncedOrgFilter = useDebouncedValue(filterOrganization, 300);
    const debouncedTitleFilter = useDebouncedValue(filterTitle, 300);

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
                {/* Filtros */}
                <FiltersPanel 
                    onOrganizationChange={setFilterOrganization}
                    onTitleChange={setFilterTitle}
                    onDateChange={setSortByDate}
                />

                {/* Ofertas Recientes */}
                <OfertasRecientes 
                    onVerTodas={() => {}}
                    isAuthenticated={false}
                    filterOrganization={debouncedOrgFilter}
                    filterTitle={debouncedTitleFilter}
                    sortByDate={sortByDate}
                />

                {/* Empresas Destacadas */}
                <EmpresasDestacadas onVerTodas={() => {}} />
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
