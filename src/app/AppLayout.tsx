"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-white flex items-center justify-center">
        {children}
      </div>
    );
  }

  const isMessages = pathname.startsWith("/messages");
  const isSearch = pathname.startsWith("/search");

  // смещение контента
  const sidebarOffset =
    isMessages || isSearch ? "ml-[80px]" : "ml-[var(--sidebar-width)]";

  // обёртка контента
  const contentWrapper =
    isMessages || isSearch ? (
      <div className="h-screen">{children}</div>
    ) : (
      <div className="mx-auto max-w-[630px] px-4 py-6">{children}</div>
    );

  return (
    <div className="relative flex min-h-screen bg-white dark:bg-black">
      <aside className="fixed left-0 top-0 z-40 h-screen">
        <Sidebar />
      </aside>

      <main
        className={`flex-1 transition-all duration-300 ease-in-out dark:text-gray-100 text-gray-900 ${sidebarOffset}`}
      >
        {contentWrapper}
      </main>
    </div>
  );
}