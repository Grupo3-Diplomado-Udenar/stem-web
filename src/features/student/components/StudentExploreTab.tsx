import EmpresasDestacadas from "../../../components/EmpresasDestacadas";
import FiltersPanel from "../../../components/FiltersPanel";
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
            <FiltersPanel />

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
