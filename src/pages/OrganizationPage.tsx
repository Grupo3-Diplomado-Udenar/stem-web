import { useState } from "react";
import { logout } from "../api/auth";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import MainLayout from "../layouts/MainLayout";
import OrganizationProfileTab from "../features/organization/components/OrganizationProfileTab";
import OrganizationVacanciesTab from "../features/organization/components/OrganizationVacanciesTab";
import OrganizationApplicantsTab from "../features/organization/components/OrganizationApplicantsTab";
import { useOrganizationProfile } from "../features/organization/hooks/useOrganizationProfile";
import { BriefcaseIcon, UsersIcon, BuildingOfficeIcon } from "../components/ui/Icons";
import type { OrgTabType } from "../features/organization/types/organization.types";

export default function OrganizationPage() {
    const [activeTab, setActiveTab] = useState<OrgTabType>("vacantes");

    const {
        // State
        showForm,
        setShowForm,
        isEditing,
        editData,
        saveMessage,
        oferta,
        skillInput,
        setSkillInput,

        // Data
        profile,
        profileErrorMessage,
        profileQuery,
        updateProfileMutation,
        offersQuery,
        applicantsQuery,

        // Handlers
        handleEditClick,
        handleEditInputChange,
        handleSaveProfile,
        handleCancelEdit,
        handleInputChange,
        addSkill,
        removeSkill,
        handlePublish,
        handleEditOffer,
        handleDeleteOffer,
    } = useOrganizationProfile(activeTab);

    const menuItems = [
        { id: "vacantes", label: "Vacantes", icon: <BriefcaseIcon className="h-5 w-5" /> },
        { id: "aplicantes", label: "Aplicantes", icon: <UsersIcon className="h-5 w-5" /> },
        { id: "perfil", label: "Mi Perfil", icon: <BuildingOfficeIcon className="h-5 w-5" /> },
    ];

    const handleLogout = () => {
        logout();
        window.location.href = "/";
    };

    const sidebar = (
        <SidebarMenu
            items={menuItems}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as OrgTabType)}
            title="Panel Empresa"
            onLogout={handleLogout}
        />
    );

    const header = (
        <Header
            variant="organization"
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            onLogout={handleLogout}
        />
    );

    return (
        <MainLayout sidebar={sidebar} header={header}>
            <div className="relative">
                {/* Mensajes de feedback */}
                {saveMessage && (
                    <div className={`fixed top-24 right-12 z-50 animate-in fade-in slide-in-from-right-8 duration-500`}>
                        <div className={`px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-3 backdrop-blur-md border ${saveMessage.type === "success"
                                ? "bg-green-500/90 text-white border-green-400"
                                : "bg-red-500/90 text-white border-red-400"
                            }`}>
                            <div className="text-2xl">{saveMessage.type === "success" ? "✅" : "❌"}</div>
                            <p className="font-bold tracking-wide">{saveMessage.text}</p>
                        </div>
                    </div>
                )}

                <div className="animate-in fade-in duration-700">
                    {activeTab === "vacantes" && (
                        <OrganizationVacanciesTab
                            showForm={showForm}
                            setShowForm={setShowForm}
                            oferta={oferta}
                            skillInput={skillInput}
                            setSkillInput={setSkillInput}
                            handleInputChange={handleInputChange}
                            addSkill={addSkill}
                            removeSkill={removeSkill}
                            handlePublish={handlePublish}
                            offersQuery={offersQuery}
                            handleEditOffer={handleEditOffer}
                            handleDeleteOffer={handleDeleteOffer}
                        />
                    )}

                    {activeTab === "aplicantes" && (
                        <OrganizationApplicantsTab applicantsQuery={applicantsQuery} />
                    )}

                    {activeTab === "perfil" && (
                        <OrganizationProfileTab
                            profile={profile}
                            isLoading={profileQuery.isLoading}
                            isError={profileQuery.isError}
                            errorMessage={profileErrorMessage}
                            isEditing={isEditing}
                            editData={editData}
                            handleEditClick={handleEditClick}
                            handleEditInputChange={handleEditInputChange}
                            handleSaveProfile={handleSaveProfile}
                            handleCancelEdit={handleCancelEdit}
                            updateProfileMutation={updateProfileMutation}
                        />
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
