import { useState } from "react";
import { login, registerStudent, registerOrganization } from "../../../api/auth";
import type { AuthMode } from "../types/auth.types";

export function useAuth(onLoginSuccess?: (type: 'student' | 'organization') => void) {
    const [mode, setMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Student Form State
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
    const [tipoIdentificacion, setTipoIdentificacion] = useState("CC");

    // Organization Form State
    const [organizationName, setOrganizationName] = useState("");
    const [nit, setNit] = useState("");

    // UI State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const changeMode = (newMode: AuthMode) => {
        setMode(newMode);
        setError(null);
        setSuccessMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        try {
            if (mode === "login") {
                const response = await login(email, password);
                console.log("Login successful:", response);
                if (onLoginSuccess) {
                    onLoginSuccess(response.user.type);
                }
            } else if (mode === "register-student") {
                if (nombres.trim().length < 2) throw new Error("Por favor ingresa tus nombres");
                if (apellidos.trim().length < 2) throw new Error("Por favor ingresa tus apellidos");
                if (numeroIdentificacion.trim().length < 3) throw new Error("Por favor ingresa tu número de identificación");

                await registerStudent(numeroIdentificacion, tipoIdentificacion, nombres, apellidos, email, password);
                setSuccessMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
                resetStudentForm();
                setTimeout(() => { setMode("login"); setSuccessMessage(null); }, 3000);
            } else if (mode === "register-organization") {
                if (organizationName.trim().length < 3) throw new Error("Por favor ingresa el nombre de la organización");
                if (nit.trim().length < 5) throw new Error("Por favor ingresa un NIT válido");

                await registerOrganization(nit, organizationName, email, password);
                setSuccessMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
                resetOrganizationForm();
                setTimeout(() => { setMode("login"); setSuccessMessage(null); }, 3000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error");
        } finally {
            setLoading(false);
        }
    };

    const resetStudentForm = () => {
        setNombres("");
        setApellidos("");
        setNumeroIdentificacion("");
        setEmail("");
        setPassword("");
    };

    const resetOrganizationForm = () => {
        setNit("");
        setOrganizationName("");
        setEmail("");
        setPassword("");
    };

    return {
        mode,
        changeMode,
        email, setEmail,
        password, setPassword,
        nombres, setNombres,
        apellidos, setApellidos,
        numeroIdentificacion, setNumeroIdentificacion,
        tipoIdentificacion, setTipoIdentificacion,
        organizationName, setOrganizationName,
        nit, setNit,
        loading,
        error,
        successMessage,
        handleSubmit,
    };
}
