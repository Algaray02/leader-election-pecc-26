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
      <header className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-blue-50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-0 bottom-0 w-40 h-40 bg-blue-200/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Welcome, <span className="text-primary">{session?.user?.name || "Voter"}</span>
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-lg">PECC Leader Election 2026 Regeneration</p>
        </div>
        <div className="relative z-10 flex items-center gap-3 bg-blue-50/80 backdrop-blur-sm px-5 py-3 rounded-2xl border border-blue-100/50 shadow-sm">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-sm font-bold text-primary tracking-wide uppercase">Election is Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="hover:border-primary/50 transition-all duration-300 shadow-xl shadow-primary/5 border border-transparent bg-white group rounded-[2rem] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] transition-transform duration-500 group-hover:scale-110"></div>
          <CardHeader className="pb-4 pt-8 px-8 border-b-0">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white text-primary transition-colors duration-300 shadow-sm border border-blue-100 group-hover:border-primary">
               <CheckSquare className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Cast Your Vote</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <p className="text-slate-500 mb-10 text-base leading-relaxed">
              Review candidate profiles, understand their vision and mission, and securely submit your choice. Your voice shapes the future of PECC.
            </p>
            <Link href="/vote" className="w-full">
              <Button className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-blue-800 transition-all group-hover:-translate-y-1">
                 Proceed to Voting <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-blue-200 transition-all duration-300 shadow-xl shadow-blue-100/50 border border-transparent bg-white rounded-[2rem] overflow-hidden">
          <CardHeader className="pb-4 pt-8 px-8 border-b-0">
            <div className="w-16 h-16 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-400 shadow-sm">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">Voting Status</CardTitle>
          </CardHeader>
          <CardContent className="px-8 pb-8">
             <div className="flex flex-col gap-6">
                 <p className="text-slate-500 text-base leading-relaxed">
                   Check your current participation state. Each eligible member may only cast one secure vote in the system.
                 </p>
                 
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <UserCircle className="w-6 h-6" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-900">Current State</p>
                         <p className="text-xs text-slate-500 font-medium">No vote recorded</p>
                       </div>
                    </div>
                    <div className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-200 tracking-wide uppercase">
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
