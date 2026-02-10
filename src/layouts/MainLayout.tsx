import type { ReactNode } from "react";

interface MainLayoutProps {
    sidebar: ReactNode;
    header?: ReactNode;
    children: ReactNode;
}

export default function MainLayout({ sidebar, header, children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                    <aside className="space-y-4">{sidebar}</aside>
                    <div className="space-y-6">
                        {header ? <div>{header}</div> : null}
                        <main>{children}</main>
                    </div>
                </div>
            </div>
        </div>
    );
}
