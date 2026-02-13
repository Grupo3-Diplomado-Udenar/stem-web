import { useAuth } from "../features/auth/hooks/useAuth";
import LoginForm from "../features/auth/components/LoginForm";
import RegisterStudentForm from "../features/auth/components/RegisterStudentForm";
import RegisterOrganizationForm from "../features/auth/components/RegisterOrganizationForm";
import AuthModeSelector from "../features/auth/components/AuthModeSelector";
import AuthLayout from "../layouts/AuthLayout";
import type { AuthPageProps } from "../features/auth/types/auth.types";

export default function AuthPage({ onLoginSuccess, onBackClick, isModal }: AuthPageProps) {
    const {
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
    } = useAuth(onLoginSuccess);

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

            <AuthModeSelector mode={mode} changeMode={changeMode} />

            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">{error}</div>}
            {successMessage && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm mb-4">{successMessage}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "login" && (
                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                    />
                )}

                {mode === "register-student" && (
                    <RegisterStudentForm
                        tipoIdentificacion={tipoIdentificacion}
                        setTipoIdentificacion={setTipoIdentificacion}
                        numeroIdentificacion={numeroIdentificacion}
                        setNumeroIdentificacion={setNumeroIdentificacion}
                        nombres={nombres}
                        setNombres={setNombres}
                        apellidos={apellidos}
                        setApellidos={setApellidos}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                    />
                )}

                {mode === "register-organization" && (
                    <RegisterOrganizationForm
                        nit={nit}
                        setNit={setNit}
                        organizationName={organizationName}
                        setOrganizationName={setOrganizationName}
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        loading={loading}
                    />
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
