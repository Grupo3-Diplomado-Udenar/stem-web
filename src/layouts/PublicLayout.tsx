import type { ReactNode } from "react";

interface PublicLayoutProps {
    header?: ReactNode;
    children: ReactNode;
}

export default function PublicLayout({ header, children }: PublicLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="sticky top-0 z-40 bg-slate-50">{header}</div>
            <main className="mx-auto max-w-7xl px-4 space-y-8">{children}</main>
        </div>
    );
}
