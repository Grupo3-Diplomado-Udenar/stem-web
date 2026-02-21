import { useState } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "../../../hook/useProfile";
import {
    useOrganizationOffersQuery,
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useDeleteOfferMutation
} from "../../../hook/useOffers";
import { useOrganizationApplicantsQuery } from "../../../hook/useApplications";
import type { Oferta, OrganizationProfile } from "../types/organization.types";

export const useOrganizationProfile = (activeTab: string) => {
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<OrganizationProfile>>({});
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
    const [oferta, setOferta] = useState<Oferta>({
        titulo: "",
        descripcion: "",
        tipo: "Práctica Profesional",
        ubicacion: "",
        duracion: "",
        salario: "",
        habilidades: [],
        fecha_cierre: "",
    });
    const [skillInput, setSkillInput] = useState("");

    // Cargar el perfil siempre para obtener el orgId
    const profileQuery = useProfileQuery(true);
    const updateProfileMutation = useUpdateProfileMutation();
    const profile = profileQuery.data as OrganizationProfile | undefined;
    const orgId = profile?.id_organizacion;

    const offersQuery = useOrganizationOffersQuery(orgId);
    const createOfferMutation = useCreateOfferMutation();
    const updateOfferMutation = useUpdateOfferMutation();
    const deleteOfferMutation = useDeleteOfferMutation();
    const applicantsQuery = useOrganizationApplicantsQuery(activeTab === "aplicantes" ? orgId : undefined);

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

    const handlePublish = async () => {
        if (!orgId) {
            setSaveMessage({
                type: "error",
                text: "No se pudo identificar la organización. Intenta recargar la página."
            });
            return;
        }

        // Crear payload base
        const basePayload = {
            titulo: oferta.titulo,
            descripcion: oferta.descripcion,
            requisitos: oferta.habilidades.join(", "),
            tipo_contrato: oferta.tipo,
            ubicacion: oferta.ubicacion,
            salario: oferta.salario ? parseFloat(oferta.salario) : undefined,
            fecha_cierre: oferta.fecha_cierre 
                ? new Date(`${oferta.fecha_cierre}T12:00:00Z`)  // 12:00:00 UTC para que sea el mismo día en cualquier zona horaria
                : undefined,
            id_organizacion: orgId,
        };

        // Solo agregar fecha_publicacion al crear ofertas nuevas
        const payload = editingOfferId 
            ? basePayload 
            : { ...basePayload, fecha_publicacion: new Date() };

        const mutation = editingOfferId ? updateOfferMutation : createOfferMutation;
        const variables = editingOfferId
            ? { id: editingOfferId, dto: payload }
            : payload;

        mutation.mutate(variables as any, {
            onSuccess: () => {
                setSaveMessage({
                    type: "success",
                    text: editingOfferId ? "Oferta actualizada" : "Oferta publicada"
                });
                setOferta({
                    titulo: "",
                    descripcion: "",
                    tipo: "Práctica Profesional",
                    ubicacion: "",
                    duracion: "",
                    salario: "",
                    habilidades: [],
                    fecha_cierre: "",
                });
                setEditingOfferId(null);
                setShowForm(false);
                setTimeout(() => setSaveMessage(null), 3000);
            },
            onError: (error: any) => {
                setSaveMessage({
                    type: "error",
                    text: error.message || "Error al procesar la oferta"
                });
            }
        });
    };

    const handleEditOffer = (offer: any) => {
        setEditingOfferId(offer.id_oferta);
        setOferta({
            titulo: offer.titulo,
            descripcion: offer.descripcion,
            tipo: offer.tipo_contrato,
            ubicacion: offer.ubicacion,
            duracion: offer.duracion || "",
            salario: offer.salario || "",
            habilidades: offer.requisitos ? offer.requisitos.split(", ") : [],
            fecha_cierre: offer.fecha_cierre 
                ? new Date(offer.fecha_cierre).toISOString().split('T')[0]
                : "",
        });
        setShowForm(true);
    };

    const handleDeleteOffer = (id: number) => {
        if (window.confirm("¿Estás seguro de eliminar esta vacante?")) {
            deleteOfferMutation.mutate({ id, orgId }, {
                onSuccess: () => {
                    setSaveMessage({ type: "success", text: "Oferta eliminada" });
                    setTimeout(() => setSaveMessage(null), 3000);
                }
            });
        }
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
    };
};
