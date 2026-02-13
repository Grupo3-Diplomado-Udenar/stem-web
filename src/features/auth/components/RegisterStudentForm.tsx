interface RegisterStudentFormProps {
    tipoIdentificacion: string;
    setTipoIdentificacion: (value: string) => void;
    numeroIdentificacion: string;
    setNumeroIdentificacion: (value: string) => void;
    nombres: string;
    setNombres: (value: string) => void;
    apellidos: string;
    setApellidos: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    loading: boolean;
}

export default function RegisterStudentForm({
    tipoIdentificacion, setTipoIdentificacion,
    numeroIdentificacion, setNumeroIdentificacion,
    nombres, setNombres,
    apellidos, setApellidos,
    email, setEmail,
    password, setPassword,
    loading
}: RegisterStudentFormProps) {
    return (
        <>
            <select
                value={tipoIdentificacion}
                onChange={(e) => setTipoIdentificacion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none bg-white"
            >
                <option value="CC">CC - Cédula de Ciudadanía</option>
                <option value="TI">TI - Tarjeta de Identidad</option>
                <option value="PA">PA - Pasaporte</option>
            </select>
            <input
                type="text"
                placeholder="Número de identificación"
                value={numeroIdentificacion}
                onChange={(e) => setNumeroIdentificacion(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <input
                type="text"
                placeholder="Nombres"
                value={nombres}
                onChange={(e) => setNombres(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <input
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-950 disabled:opacity-50 transition"
            >
                {loading ? "Registrando..." : "Registrarse"}
            </button>
        </>
    );
}
