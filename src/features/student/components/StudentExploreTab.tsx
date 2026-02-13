import EmpresasDestacadas from "../../../components/EmpresasDestacadas";
import OfertasRecientes from "../../../components/OfertasRecientes";

export default function StudentExploreTab() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="rounded-2xl bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Encuentra tu Práctica Profesional Ideal</h2>
                <p className="text-blue-100">Conectamos talento STEM con las mejores oportunidades del sector productivo</p>
            </div>

            {/* Filtros */}
            <div className="rounded-xl border bg-white p-6">
                <div className="flex items-center gap-2 mb-6">
                    <span className="text-xl"></span>
                    <h3 className="text-lg font-semibold text-gray-900">Filtros de Búsqueda</h3>
                </div>
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Carrera</label>
                        <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white cursor-pointer hover:border-gray-400">
                            <option>Todas las Carreras</option>
                            <option>Ingeniería de Sistemas</option>
                            <option>Ingeniería de Software</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                        <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white cursor-pointer hover:border-gray-400">
                            <option>Todas las Ubicaciones</option>
                            <option>Bogotá</option>
                            <option>Medellín</option>
                            <option>Cali</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Contrato</label>
                        <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white cursor-pointer hover:border-gray-400">
                            <option>Todos los Tipos</option>
                            <option>Práctica Profesional</option>
                            <option>Pasantía</option>
                            <option>Contrato Temporal</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Empresas Destacadas */}
            <EmpresasDestacadas onVerTodas={() => { }} />

            {/* Ofertas Recientes */}
            <OfertasRecientes
                onVerDetalles={(oferta) => {
                    console.log("Ver detalles de oferta:", oferta);
                }}
                onVerTodas={() => { }}
                isAuthenticated={true}
                searchTerm=""
            />
        </div>
    );
}
