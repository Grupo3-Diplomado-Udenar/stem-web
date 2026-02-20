// TODO: Conectar este componente con el backend
// Empresas destacadas deben ordenarse por mayor número de postulaciones
// Pendiente implementación de consulta dinámica

interface EmpresasDestacadasProps {
    onVerTodas?: () => void;
}

export default function EmpresasDestacadas({ onVerTodas }: EmpresasDestacadasProps) {
    const empresas = [
        { name: "TechCorp", category: "Software", icon: "💻", vacantes: 12 },
        { name: "DataLabs", category: "Análisis de Datos", icon: "📊", vacantes: 8 },
        { name: "InnovateTech", category: "IA & ML", icon: "💡", vacantes: 15 },
        { name: "CloudSystems", category: "Cloud Computing", icon: "☁️", vacantes: 6 },
        { name: "BioTech Solutions", category: "Biotecnología", icon: "🧬", vacantes: 9 },
        { name: "CyberSecure", category: "Ciberseguridad", icon: "🔒", vacantes: 7 },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Empresas Destacadas</h3>
                <button 
                    onClick={onVerTodas}
                    className="text-teal-600 hover:text-teal-700 font-medium transition"
                >
                    Ver todas
                </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
                {empresas.map((empresa) => (
                    <div key={empresa.name} className="rounded-xl border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer bg-white">
                        <div className="text-4xl mb-3">{empresa.icon}</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-1">{empresa.name}</h4>
                        <p className="text-sm text-gray-600 mb-4">{empresa.category}</p>
                        <div className="flex items-center gap-1 text-teal-600 font-medium">
                            📍 {empresa.vacantes} vacantes activas
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
