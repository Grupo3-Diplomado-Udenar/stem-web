interface RegisterOrganizationFormProps {
    nit: string;
    setNit: (value: string) => void;
    organizationName: string;
    setOrganizationName: (value: string) => void;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    loading: boolean;
}

export default function RegisterOrganizationForm({
    nit, setNit,
    organizationName, setOrganizationName,
    email, setEmail,
    password, setPassword,
    loading
}: RegisterOrganizationFormProps) {
    return (
        <>
            <input
                type="text"
                placeholder="NIT"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none"
            />
            <input
                type="text"
                placeholder="Nombre de la organización"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
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
                {loading ? "Registrando..." : "Registrar Organización"}
            </button>
        </>
    );
}
