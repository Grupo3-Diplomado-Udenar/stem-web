import type { ReactNode } from "react";

interface PublicLayoutProps {
    header?: ReactNode;
    children: ReactNode;
}

export default function PublicLayout({ header, children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            {header}
            <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">{children}</main>
        </div>
    );
}
