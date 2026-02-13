import type { AuthMode } from "../types/auth.types";

interface AuthModeSelectorProps {
    mode: AuthMode;
    changeMode: (mode: AuthMode) => void;
}

export default function AuthModeSelector({ mode, changeMode }: AuthModeSelectorProps) {
    return (
        <div className="flex gap-2 mb-6">
            <button
                type="button"
                onClick={() => changeMode("login")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${mode === "login" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
            >
                Login
            </button>
            <button
                type="button"
                onClick={() => changeMode("register-student")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${mode === "register-student" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
            >
                Estudiante
            </button>
            <button
                type="button"
                onClick={() => changeMode("register-organization")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${mode === "register-organization" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
            >
                Organización
            </button>
        </div>
    );
}
