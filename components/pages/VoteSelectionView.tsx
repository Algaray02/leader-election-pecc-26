"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVoterCandidates } from "@/hooks/useVoter";
import { Loader2, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export function VoteSelectionView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: candidatesResponse = [], isLoading } = useVoterCandidates();
  const candidates = Array.isArray(candidatesResponse) ? candidatesResponse : (candidatesResponse.data || []);


  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-blue-50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-primary text-sm font-bold mb-4 uppercase tracking-widest">
            <User className="w-4 h-4" /> Official Candidates
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-blue-900 leading-tight">
            Select Your <span className="text-primary">Leader</span>
          </h2>
          <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">
            Review the profiles of the candidates and make your voice heard for the Polytechnic English Conversation Club Regeneration 2026.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-500 gap-4">
           <Loader2 className="w-12 h-12 animate-spin text-primary" />
           <p className="font-bold text-lg animate-pulse">Loading candidates...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 justify-items-center">
          {candidates.map((c: any, index: number) => {
            const imageColors = ["from-blue-700 to-blue-500", "from-blue-600 to-blue-400", "from-blue-500 to-blue-300"];
            const themeColor = imageColors[index % imageColors.length];
            const highlight = "border-blue-100";
            const formattedNumber = String(c.candidateNumber).padStart(2, '0');

            return (
            <Card key={c.id} className={`w-full max-w-sm overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 transition-all duration-500 border border-blue-50 bg-gradient-to-br ${themeColor} rounded-[2rem] relative flex flex-col p-2`}>
              {/* Background effects spanning the whole card */}
              <div className="absolute inset-0 bg-white/10 mix-blend-overlay z-0 pointer-events-none"></div>
              <div className="absolute inset-0 opacity-20 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
              
              <div className="relative z-20 w-full pt-8">
                <div className="absolute top-2 right-4 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-sm font-black shadow-lg border border-white/30 tracking-widest pointer-events-none">
                  #{formattedNumber}
                </div>
                <div className="flex justify-center -mb-16">
                  <div className={`w-36 h-36 rounded-full border-[6px] bg-white shadow-xl flex items-center justify-center overflow-hidden z-30 relative ${highlight}`}>
                    {c.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={c.imageUrl} alt={`${c.name} avatar`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-blue-50/50 flex items-center justify-center">
                         <User className="w-14 h-14 text-blue-200" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="bg-white/95 backdrop-blur-xl flex-1 pt-24 pb-8 px-8 text-center flex flex-col items-center rounded-3xl relative z-10 shadow-inner">
                <h4 className="font-extrabold text-2xl text-blue-900 group-hover:text-blue-600 transition-colors">{c.name}</h4>
                <p className="text-sm text-blue-500/80 mb-8 font-bold uppercase tracking-wider">{"Leader Candidate"}</p>
                
                <Link href={`/vote/${c.id}`} className="w-full mt-auto">
                  <Button className="w-full h-14 rounded-xl text-md font-bold text-primary bg-blue-50 hover:bg-primary hover:text-white transition-all duration-300 border border-blue-100 shadow-sm group-hover:shadow-md cursor-pointer">
                     View Full Profile <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )})}
        </div>
      )}
    </div>
  );
}
