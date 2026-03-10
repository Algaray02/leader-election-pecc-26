"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckSquare, UserCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function VoterDashboardView() {
  const { data: session } = useSession();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome banner */}
      <header className="bg-gradient-to-br from-[#5D0F1D] via-[#4A0E17] to-[#2D060C] p-8 md:p-10 rounded-[2rem] shadow-xl border border-[#D4AF37]/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-[#FDFBF7]">
            Welcome, <span className="text-[#D4AF37]">{session?.user?.name || "Voter"}</span>
          </h2>
          <p className="text-[#FDFBF7]/70 mt-2 font-medium text-lg">PECC Leader Election 2026 Regeneration</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-[#D4AF37]/10 backdrop-blur-sm px-5 py-3 rounded-2xl border border-[#D4AF37]/30 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
          <span className="text-sm font-bold text-[#D4AF37] tracking-wide uppercase">Election is Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cast Vote card */}
        <Card className="hover:border-[#D4AF37]/50 transition-all duration-300 shadow-xl shadow-[#5D0F1D]/5 border border-[#D4AF37]/20 bg-[#FFFDF9] group rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
          <CardHeader className="pb-4 pt-8 px-8 border-b-0">
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-[#5D0F1D] group-hover:to-[#4A0E17] group-hover:text-[#D4AF37] text-[#4A0E17] transition-colors duration-300 shadow-sm border border-[#D4AF37]/20">
               <CheckSquare className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#4A0E17]">Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-[#6B4F43] mb-10 text-base leading-relaxed">
              Review candidate profiles, understand their vision and mission, and securely submit your choice. Your voice shapes the future of PECC.
            </p>
            <Link href="/vote" className="w-full">
              <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-[#5D0F1D]/20 bg-gradient-to-r from-[#5D0F1D] to-[#4A0E17] hover:from-[#75141C] hover:to-[#5D0F1D] text-[#D4AF37] border border-[#3A0A11] transition-all group-hover:-translate-y-1 cursor-pointer">
                 Proceed to Voting <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Voting status card */}
        <Card className="hover:border-[#D4AF37]/40 transition-all duration-300 shadow-xl shadow-[#D4AF37]/5 border border-[#D4AF37]/20 bg-[#FFFDF9] rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-4 pt-8 px-8 border-b-0">
            <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-6 text-[#D4AF37] shadow-sm">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#4A0E17]">Voting Status</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
             <div className="flex flex-col gap-6">
                 <p className="text-[#6B4F43] text-base leading-relaxed">
                   Check your current participation state. Each eligible member may only cast one secure vote in the system.
                 </p>
                 <div className="flex items-center justify-between p-6 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#4A0E17]">
                          <UserCircle className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-[#4A0E17]">Current State</p>
                         <p className="text-xs text-[#6B4F43] font-medium">No vote recorded</p>
                       </div>
                    </div>
                    <div className="px-4 py-1.5 bg-[#D4AF37]/10 text-[#4A0E17] rounded-full text-xs font-bold border border-[#D4AF37]/30 tracking-wide uppercase">
                       Pending
                    </div>
                 </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
