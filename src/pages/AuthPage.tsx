import { useState } from "react";
import { login, registerStudent, registerOrganization } from "../api/auth";
import AuthLayout from "../layouts/AuthLayout";

type AuthMode = "login" | "register-student" | "register-organization";

interface AuthPageProps {
    onLoginSuccess?: (type: 'student' | 'organization') => void;
    onBackClick?: () => void;
    isModal?: boolean;
}

export default function AuthPage({ onLoginSuccess, onBackClick, isModal }: AuthPageProps) {
    const [mode, setMode] = useState<AuthMode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nombres, setNombres] = useState("");
    const [apellidos, setApellidos] = useState("");
    const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
    const [tipoIdentificacion, setTipoIdentificacion] = useState("CC");
    const [organizationName, setOrganizationName] = useState("");
    const [nit, setNit] = useState("");
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
                setNombres("");
                setApellidos("");
                setNumeroIdentificacion("");
                setEmail("");
                setPassword("");
                setTimeout(() => { setMode("login"); setSuccessMessage(null); }, 3000);
            } else if (mode === "register-organization") {
                if (organizationName.trim().length < 3) throw new Error("Por favor ingresa el nombre de la organización");
                if (nit.trim().length < 5) throw new Error("Por favor ingresa un NIT válido");
                
                await registerOrganization(nit, organizationName, email, password);
                setSuccessMessage("¡Registro exitoso! Ya puedes iniciar sesión.");
                setNit("");
                setOrganizationName("");
                setEmail("");
                setPassword("");
                setTimeout(() => { setMode("login"); setSuccessMessage(null); }, 3000);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Ocurrió un error");
        } finally {
            setLoading(false);
        }
    };

    const authContent = (
        <>
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {mode === "login" && "Iniciar Sesión"}
                    {mode === "register-student" && "Registro de Estudiante"}
                    {mode === "register-organization" && "Registro de Organización"}
                </h1>
                <p className="text-gray-600">
                    {mode === "login" && "Accede a tu cuenta"}
                    {mode === "register-student" && "Crea tu cuenta como estudiante"}
                    {mode === "register-organization" && "Registra tu organización"}
                </p>
            </div>

            <div className="flex gap-2 mb-6">
                <button
                    type="button"
                    onClick={() => changeMode("login")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        mode === "login" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => changeMode("register-student")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        mode === "register-student" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Estudiante
                </button>
                <button
                    type="button"
                    onClick={() => changeMode("register-organization")}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                        mode === "register-organization" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                    Organización
                </button>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">{error}</div>}
            {successMessage && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "login" && (
                    <>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-950 disabled:opacity-50 transition">
                            {loading ? "Iniciando..." : "Iniciar Sesión"}
                        </button>
                    </>
                )}

                {mode === "register-student" && (
                    <>
                        <select value={tipoIdentificacion} onChange={(e) => setTipoIdentificacion(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none bg-white">
                            <option value="CC">CC - Cédula de Ciudadanía</option>
                            <option value="TI">TI - Tarjeta de Identidad</option>
                            <option value="PA">PA - Pasaporte</option>
                        </select>
                        <input type="text" placeholder="Número de identificación" value={numeroIdentificacion} onChange={(e) => setNumeroIdentificacion(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="text" placeholder="Nombres" value={nombres} onChange={(e) => setNombres(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-950 disabled:opacity-50 transition">
                            {loading ? "Registrando..." : "Registrarse"}
                        </button>
                    </>
                )}

                {mode === "register-organization" && (
                    <>
                        <input type="text" placeholder="NIT" value={nit} onChange={(e) => setNit(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="text" placeholder="Nombre de la organización" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none" />
                        <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-950 disabled:opacity-50 transition">
                            {loading ? "Registrando..." : "Registrar Organización"}
                        </button>
                    </>
                )}
            </form>
        </>
    );

    if (isModal) {
        return (
            <div className="bg-white rounded-2xl shadow-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onBackClick}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center transition"
                >
                    ✕
                </button>
                <div className="pr-6">
                    {authContent}
                </div>
            </div>
        );
    }

    return (
        <AuthLayout>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                {authContent}
            </div>
        </AuthLayout>
    );
}
