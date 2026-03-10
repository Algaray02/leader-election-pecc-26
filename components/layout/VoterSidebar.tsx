"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, BarChart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Badge } from "@/components/ui/badge";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vote Candidate", href: "/vote", icon: CheckSquare },
  { name: "Live Results", href: "/results", icon: BarChart },
];

export function VoterSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-primary border-r border-blue-800 flex flex-col h-full z-10 hidden md:flex shadow-2xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-10"></div>
      
      <div className="relative z-10 p-6 border-b border-blue-800/50 flex items-center space-x-4">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-black text-2xl shadow-lg border-b-4 border-blue-200">
          P
        </div>
        <div>
          <h1 className="font-extrabold text-sm leading-tight text-white uppercase tracking-wider">PECC Election</h1>
          <p className="text-xs text-blue-200 font-medium tracking-wide">Regeneration 2026</p>
        </div>
      </div>
      <nav className="relative z-10 flex-1 overflow-y-auto py-8 px-5 space-y-1">
        <ul className="space-y-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            // Active if the pathname starts with the link href (for nested like /vote/[id])
            // Except for /dashboard, maybe exact match
            const isActive = link.href === "/vote" 
                ? pathname.startsWith("/vote")
                : pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-4 rounded-2xl group transition-all duration-300 font-semibold shadow-sm w-full",
                    isActive
                      ? "bg-secondary text-primary shadow-lg border-b-4 border-yellow-500 scale-[1.02]"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive ? "text-primary flex-shrink-0" : "text-blue-200 flex-shrink-0 group-hover:text-white transition-colors")} />
                  <span className="text-sm tracking-wide">{link.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="relative z-10 p-6 border-t border-blue-800/50 space-y-4 bg-primary/90 backdrop-blur-sm">
        <div className="bg-blue-900/40 rounded-xl p-4 flex items-center justify-between border border-blue-700/30">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">System</span>
          <span className="flex items-center text-xs font-black text-green-400">
             <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
             SECURE
          </span>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-red-200 bg-red-900/30 hover:bg-red-500/30 rounded-xl transition-all duration-300 border border-red-900/50 hover:border-red-500/50 group font-bold tracking-wide"
        >
          <LogOut className="w-5 h-5 -scale-x-100 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
