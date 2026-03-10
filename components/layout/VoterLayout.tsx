"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VoterLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden font-sans text-slate-800 relative">
      <main className="flex-1 overflow-y-auto w-full p-6 md:p-12 lg:p-20 mx-auto relative z-10 flex flex-col min-h-screen">
         {/* Subtle pure blue pattern */}
         <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1d4ed8 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
         
         {/* Simple Header */}
         <header className="w-full max-w-5xl mx-auto flex items-center justify-between mb-10 z-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 relative">
                 <Image src="/images/logo/pecc_logo.png" width={80} height={80} alt="PECC Logo" className="object-contain" />
               </div>
               <div>
                  <h1 className="font-extrabold text-sm leading-tight text-primary uppercase tracking-wider">Leader Election 2026</h1>
                  <p className="text-xs text-slate-500 font-medium tracking-wide">PECC 2025/2026</p>
               </div>
            </div>
            
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => signOut({ callbackUrl: '/' })}
               className="cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 font-bold px-4 transition-colors"
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
