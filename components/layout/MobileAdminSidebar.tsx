"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserPen, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Participant Manage", href: "/admin/participants", icon: Users },
  { name: "Candidate Manage", href: "/admin/candidates", icon: UserPen },
];

export function MobileAdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleNavigation = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button
          variant="ghost"
          className="px-2 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 p-0 bg-gradient-to-b from-[#5D0F1D] via-[#4A0E17] to-[#2D060C] border-r border-[#D4AF37]/30"
      >
        <SheetTitle className="sr-only">Admin Navigation</SheetTitle>
        <SheetDescription className="sr-only">Admin portal navigation menu</SheetDescription>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[#D4AF37]/30 flex items-center space-x-4">
            <div className="w-12 h-12 bg-[#FDFBF7] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] border-b-4 border-[#D4AF37] relative overflow-hidden">
              <Image
                src="/images/logo/pecc_logo.png"
                alt="PECC Logo"
                fill
                sizes="48px"
                className="object-contain p-1"
              />
            </div>
            <div>
              <h1 className="font-extrabold text-sm leading-tight text-[#D4AF37] uppercase tracking-widest drop-shadow-sm">
                Admin Portal
              </h1>
              <p className="text-xs text-[#FDFBF7]/70 font-bold tracking-wide">
                PECC Leader Election '26
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto py-8 px-5 space-y-1">
            <ul className="space-y-3">
              {sidebarLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={handleNavigation}
                      className={cn(
                        "flex items-center gap-4 px-4 py-4 rounded-2xl group transition-all duration-300 font-semibold w-full",
                        isActive
                          ? "bg-gradient-to-r from-[#D4AF37] to-[#F7B757] text-[#4A0E17] shadow-[0_4px_20px_rgba(212,175,55,0.35)] border-b-4 border-[#8B6508] scale-[1.02]"
                          : "text-[#FDFBF7]/70 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5 shrink-0 transition-colors",
                          isActive
                            ? "text-[#4A0E17]"
                            : "text-[#FDFBF7]/40 group-hover:text-[#D4AF37]"
                        )}
                      />
                      <span className="text-sm tracking-wide">{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-[#D4AF37]/30 space-y-4">
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-[#4A0E17] bg-gradient-to-r from-[#D4AF37] to-[#F7B757] hover:from-[#F7B757] hover:to-[#D4AF37] rounded-xl transition-all duration-300 border border-[#8B6508] shadow-[0_4px_15px_rgba(212,175,55,0.25)] group font-bold tracking-wide"
            >
              <LogOut className="w-5 h-5 -scale-x-100 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">Log Out</span>
            </button>
            <div className="mt-2 text-center text-[10px] text-[#FDFBF7]/30 font-bold uppercase tracking-widest">
              © 2026 PECC. All rights reserved.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
