interface FiltersPanelProps {
    onOrganizationChange?: (value: string) => void;
    onTitleChange?: (value: string) => void;
    onDateChange?: (value: string) => void;
}

export default function FiltersPanel({
    onOrganizationChange,
    onTitleChange,
    onDateChange,
}: FiltersPanelProps) {
    return (
        <div className="bg-gradient-to-r from-blue-900 to-teal-600 p-8 text-white">
            
            <div className="grid grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Organización</label>
                    <input
                        type="text"
                        placeholder="Buscar por organización"
                        onChange={(e) => onOrganizationChange?.(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white hover:border-gray-400 focus:border-teal-500 focus:outline-none placeholder-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Título de Oferta</label>
                    <input
                        type="text"
                        placeholder="Buscar por título"
                        onChange={(e) => onTitleChange?.(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white hover:border-gray-400 focus:border-teal-500 focus:outline-none placeholder-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white mb-2">Ordenar por Fecha</label>
                    <select
                        onChange={(e) => onDateChange?.(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 bg-white cursor-pointer hover:border-gray-400 focus:border-teal-500 focus:outline-none"
                    >
                        <option value="">Sin ordenar</option>
                        <option value="newest">Más recientes primero</option>
                        <option value="oldest">Más antiguas primero</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
