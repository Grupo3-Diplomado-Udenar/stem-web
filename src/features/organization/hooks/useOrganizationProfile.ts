import { useState } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "../../../hook/useProfile";
import type { Oferta, OrganizationProfile } from "../types/organization.types";

export const useOrganizationProfile = (activeTab: string) => {
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

    return {
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

        // Handlers
        handleEditClick,
        handleEditInputChange,
        handleSaveProfile,
        handleCancelEdit,
        handleInputChange,
        addSkill,
        removeSkill,
        handlePublish,
    };
};
