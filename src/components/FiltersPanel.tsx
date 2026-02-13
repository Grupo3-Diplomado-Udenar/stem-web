interface FiltersPanelProps {
    title?: string;
    showIcon?: boolean;
    icon?: string;
}

export default function FiltersPanel({
    title = "Filtros de Búsqueda",
    showIcon = true,
    icon = "⚙️",
}: FiltersPanelProps) {
    return (
        <div className="rounded-xl border bg-white p-6">
            <div className="flex items-center gap-2 mb-6">
                {showIcon ? <span className="text-xl">{icon}</span> : null}
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
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
    );
}
