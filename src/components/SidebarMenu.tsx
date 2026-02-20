import type { ReactNode } from "react";

interface SidebarItem {
    id: string;
    label: string;
    icon?: ReactNode;
}

interface SidebarMenuProps {
    title?: string;
    items: SidebarItem[];
    activeId: string;
    onChange: (id: string) => void;
    onLogout?: () => void;
    logoutLabel?: string;
}

export default function SidebarMenu({
    title,
    items,
    activeId,
    onChange,
    onLogout,
    logoutLabel = "Cerrar Sesión",
}: SidebarMenuProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
            {title ? <p className="text-sm font-semibold text-gray-500 mb-4">{title}</p> : null}
            <nav className="flex flex-col gap-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onChange(item.id)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            activeId === item.id
                                ? "bg-[#014766] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        {item.icon ?? <span className="text-lg">•</span>}
                        {item.label}
                    </button>
                ))}
            </nav>
            {onLogout ? (
                <div className="mt-4 border-t border-gray-200 pt-3">
                    <button
                        onClick={onLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.5}
                            aria-hidden="true"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6A2.25 2.25 0 0 0 5.25 5.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9l3 3m0 0-3 3m3-3H8.25"
                            />
                        </svg>
                        <span>{logoutLabel}</span>
                    </button>
                </div>
            ) : null}
        </div>
    );
}
