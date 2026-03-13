"use client";

import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { MobileAdminSidebar } from "./MobileAdminSidebar";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#FDFBF7] overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto w-full relative flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-gradient-to-r from-[#5D0F1D] via-[#4A0E17] to-[#2D060C] border-b border-[#D4AF37]/30 p-4 flex items-center justify-between">
          <h1 className="font-extrabold text-base text-[#D4AF37] uppercase tracking-widest">Admin Portal</h1>
          <MobileAdminSidebar />
        </div>

        {/* Dot pattern — sama seperti LoginView */}
        <div
          className="absolute inset-0 z-0 opacity-40 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(#6B4F43 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="relative z-10 w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}