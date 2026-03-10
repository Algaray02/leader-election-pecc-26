"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#FDFBF7] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto w-full relative">
        {/* Dot pattern — sama seperti LoginView */}
        <div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#6B4F43 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}