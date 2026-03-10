"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserPen, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Participant Manage", href: "/admin/participants", icon: Users },
  { name: "Candidate Manage", href: "/admin/candidates", icon: UserPen },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-blue-100 flex-col h-full z-10 hidden md:flex shadow-2xl shadow-primary/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 p-6 border-b border-blue-50 flex items-center space-x-4">
        <div className="w-12 h-12 relative">
          <Image src="/images/logo/pecc_logo.png" alt="PECC Logo" fill sizes="48px" className="object-contain" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm leading-tight text-blue-900 uppercase tracking-wider">Admin Portal</h1>
          <p className="text-xs text-primary font-bold tracking-wide">PECC Leader Election '26</p>
        </div>
      </div>
      <nav className="relative z-10 flex-1 overflow-y-auto py-8 px-5 space-y-1 bg-white/50 backdrop-blur-sm">
        <ul className="space-y-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 rounded-2xl group transition-all duration-300 font-semibold shadow-sm w-full",
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20 border-b-4 border-blue-800 scale-[1.02]"
                      : "text-slate-600 hover:bg-blue-50 hover:text-primary"
                  )}
                >
                  <Icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-primary transition-colors")} />
                  <span className="text-sm tracking-wide">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="relative z-10 p-6 border-t border-blue-50 space-y-4 bg-white">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-300 border border-red-100 group font-bold tracking-wide"
        >
          <LogOut className="w-5 h-5 -scale-x-100 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Log Out</span>
        </button>
        <div className="mt-4 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          © 2026 PECC. All rights reserved.
        </div>
      </div>
    </aside>
  );
}
