"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VoterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-[#FDFBF7] overflow-hidden font-sans text-[#4A0E17] relative">
      <main className="flex-1 overflow-y-auto w-full p-6 md:p-12 lg:p-20 mx-auto relative z-10 flex flex-col min-h-screen">
         {/* Royal dot pattern */}
         <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6B4F43 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
         {/* Gold glow top-right */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none"></div>

         {/* Header */}
         <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-10 z-10 relative">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 relative bg-[#FDFBF7] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.25)] border border-[#D4AF37]/30 overflow-hidden">
                 <Image src="/images/logo/pecc_logo.png" width={36} height={36} alt="PECC Logo" className="object-contain" />
               </div>
               <div>
                  <h1 className="font-extrabold text-sm leading-tight text-[#4A0E17] uppercase tracking-wider">Leader Election 2026</h1>
                  <p className="text-xs text-[#6B4F43] font-medium tracking-wide">PECC 2025/2026</p>
               </div>
            </div>

            <Button
               variant="ghost"
               size="sm"
               onClick={() => signOut({ callbackUrl: '/' })}
               className="cursor-pointer text-[#4A0E17] hover:text-[#5D0F1D] hover:bg-[#D4AF37]/10 font-bold px-4 transition-colors border border-transparent hover:border-[#D4AF37]/30"
            >
               <LogOut className="w-4 h-4 mr-2" />
               Log Out
            </Button>
         </header>

         <div className="relative z-10 w-full max-w-5xl mx-auto flex-1 flex flex-col">
            {children}
         </div>
      </main>
    </div>
  );
}
