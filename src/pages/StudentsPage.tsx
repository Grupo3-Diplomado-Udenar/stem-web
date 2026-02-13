import { useState } from "react";
import { logout } from "../api/auth";
import Header from "../components/Header";
import SidebarMenu from "../components/SidebarMenu";
import Toast from "../components/Toast";
import MainLayout from "../layouts/MainLayout";
import { MagnifyingGlassIcon, UserIcon } from "../components/ui/Icons";
import { useStudentProfile } from "../features/student/hooks/useStudentProfile";
import StudentExploreTab from "../features/student/components/StudentExploreTab";
import StudentProfileTab from "../features/student/components/StudentProfileTab";

type TabType = "explorar" | "perfil";

export default function StudentsPage() {
    const [activeTab, setActiveTab] = useState<TabType>("explorar");

    // Use the custom hook for all profile logic
    const {
        isEditing,
        editData,
        educationEntries,
        educationError,
        saveMessage,
        universities,
        careersByUniversity,
        isLoadingUniversities,
        loadingCareersByUniversity,
        student,
        studentErrorMessage,
        profileQuery,
        studentQuery,
        isSaving,
        handleEditClick,
        handleEditInputChange,
        handleEducationChange,
        addEducationEntry,
        handleRemoveCareer,
        handleCancel,
        handleSaveProfile
    } = useStudentProfile();

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

            {activeTab === "explorar" && <StudentExploreTab />}

            {activeTab === "perfil" && (
                <StudentProfileTab
                    profileLoading={profileQuery.isLoading}
                    studentLoading={studentQuery.isLoading}
                    profileError={profileQuery.isError}
                    studentError={studentQuery.isError}
                    profileErrorMessage={
                        profileQuery.error instanceof Error
                            ? profileQuery.error.message
                            : "No pudimos cargar el perfil."
                    }
                    studentErrorMessage={studentErrorMessage}
                    student={student}
                    isEditing={isEditing}
                    editData={editData}
                    educationEntries={educationEntries}
                    educationError={educationError}
                    universities={universities}
                    careersByUniversity={careersByUniversity}
                    isLoadingUniversities={isLoadingUniversities}
                    loadingCareersByUniversity={loadingCareersByUniversity}
                    isSaving={isSaving}
                    handleEditClick={handleEditClick}
                    handleEditInputChange={handleEditInputChange}
                    handleEducationChange={handleEducationChange}
                    addEducationEntry={addEducationEntry}
                    handleRemoveCareer={handleRemoveCareer}
                    handleCancel={handleCancel}
                    handleSaveProfile={handleSaveProfile}
                />
            )}
        </MainLayout>
    );
}


