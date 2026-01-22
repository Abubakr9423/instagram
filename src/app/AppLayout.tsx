"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // ✅ AUTH PAGES — NO SIDEBAR, NO MARGINS
    if (pathname === "/" || pathname === "/login" || pathname === "/register") {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                {children}
            </div>
        );
    }

    const isMessages = pathname.startsWith("/messages");

    return (
        <div className="relative flex min-h-screen bg-white dark:bg-black">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen">
                <Sidebar />
            </aside>

            {/* Main Content */}
            <main
                className={`
          flex-1
          transition-all
          duration-300
          ease-in-out
          dark:text-gray-100
          text-gray-900
          ${isMessages ? "ml-[80px]" : "ml-[var(--sidebar-width)]"}
        `}
            >
                {isMessages ? (
                    // 💬 Messages page → full width next to sidebar
                    <div className="h-screen">
                        {children}
                    </div>
                ) : (
                    // 🏠 Normal pages → centered feed
                    <div className="mx-auto max-w-[630px] px-4 py-6">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}
