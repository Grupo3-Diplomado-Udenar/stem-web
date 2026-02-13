import { useState } from "react";
import { logout } from "../api/auth";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import Toast from "../components/Toast";
import MainLayout from "../layouts/MainLayout";
import { BriefcaseIcon, BuildingOfficeIcon, UsersIcon } from "../components/ui/Icons";
import { useOrganizationProfile } from "../features/organization/hooks/useOrganizationProfile";
import OrganizationVacanciesTab from "../features/organization/components/OrganizationVacanciesTab";
import OrganizationApplicantsTab from "../features/organization/components/OrganizationApplicantsTab";
import OrganizationProfileTab from "../features/organization/components/OrganizationProfileTab";
import type { OrgTabType } from "../features/organization/types/organization.types";

export default function OrganizationPage() {
    const [activeTab, setActiveTab] = useState<OrgTabType>("vacantes");

    // Use the custom hook for logic
    const {
        showForm,
        setShowForm,
        isEditing,
        editData,
        saveMessage,
        oferta,
        skillInput,
        setSkillInput,
        profile,
        profileErrorMessage,
        profileQuery,
        updateProfileMutation,
        handleEditClick,
        handleEditInputChange,
        handleSaveProfile,
        handleCancelEdit,
        handleInputChange,
        addSkill,
        removeSkill,
        handlePublish,
    } = useOrganizationProfile(activeTab);

    const handleLogout = () => {
        logout();
        window.location.href = '/';
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
                />
            )}

            {activeTab === "aplicantes" && (
                <OrganizationApplicantsTab />
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
        </MainLayout>
    );
}
