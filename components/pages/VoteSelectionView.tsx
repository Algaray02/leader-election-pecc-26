"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVoterCandidates } from "@/hooks/useVoter";
import { Loader2, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

// Royal gradient per candidate slot
const cardGradients = [
  "from-[#5D0F1D] via-[#4A0E17] to-[#2D060C]",
  "from-[#3A0A11] via-[#5D0F1D] to-[#4A0E17]",
  "from-[#2D060C] via-[#4A0E17] to-[#5D0F1D]",
];

export function VoteSelectionView() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: candidatesResponse = [], isLoading } = useVoterCandidates();
  const candidates = Array.isArray(candidatesResponse) ? candidatesResponse : (candidatesResponse.data || []);

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 bg-gradient-to-br from-[#5D0F1D] via-[#4A0E17] to-[#2D060C] p-8 rounded-[2rem] shadow-xl border border-[#D4AF37]/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] text-sm font-bold mb-4 uppercase tracking-widest">
            <User className="w-4 h-4" /> Official Candidates
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-[#FDFBF7] leading-tight">
            Select Your <span className="text-[#D4AF37]">Leader</span>
          </h2>
          <p className="text-[#FDFBF7]/70 mt-4 text-lg font-medium leading-relaxed">
            Review the profiles of the candidates and make your voice heard for the Polytechnic English Conversation Club Regeneration 2026.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#6B4F43] gap-4">
           <Loader2 className="w-12 h-12 animate-spin text-[#5D0F1D]" />
           <p className="font-bold text-lg animate-pulse text-[#4A0E17]">Loading candidates...</p>
        </div>
      ) : (
        <div className={`gap-8 lg:gap-10 justify-items-center ${
          candidates.length === 2 
            ? "flex flex-wrap justify-center" 
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}>
          {candidates.map((c: any, index: number) => {
            const gradient = cardGradients[index % cardGradients.length];
            const formattedNumber = String(c.candidateNumber).padStart(2, '0');

            return (
            <Card key={c.id} className={`w-full max-w-sm overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#5D0F1D]/20 transition-all duration-500 border border-[#D4AF37]/30 bg-gradient-to-br ${gradient} rounded-[2rem] relative flex flex-col p-2`}>
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}></div>
              <div className="absolute inset-0 bg-[#D4AF37]/5 mix-blend-overlay z-0 pointer-events-none"></div>
              
              <div className="relative z-20 w-full pt-8">
                <div className="absolute top-2 right-4 bg-[#D4AF37]/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[#D4AF37] text-sm font-black shadow-lg border border-[#D4AF37]/40 tracking-widest pointer-events-none">
                  #{formattedNumber}
                </div>
                <div className="flex justify-center -mb-16">
                  <div className="w-36 h-36 rounded-full border-[6px] border-[#D4AF37]/40 bg-[#FDFBF7] shadow-xl flex items-center justify-center overflow-hidden z-30 relative">
                    {c.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={c.imageUrl} alt={`${c.name} avatar`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[#D4AF37]/10 flex items-center justify-center">
                         <User className="w-14 h-14 text-[#D4AF37]/60" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <CardContent className="bg-[#FFFDF9]/95 backdrop-blur-xl flex-1 pt-24 pb-8 px-8 text-center flex flex-col items-center rounded-3xl relative z-10 shadow-inner">
                <h4 className="font-extrabold text-2xl text-[#4A0E17] group-hover:text-[#5D0F1D] transition-colors">{c.name}</h4>
                <p className="text-sm text-[#6B4F43] mb-8 font-bold uppercase tracking-wider">{"Leader Candidate"}</p>
                
                <Link href={`/vote/${c.id}`} className="w-full mt-auto">
                  <Button className="w-full h-14 rounded-xl text-md font-bold text-[#4A0E17] bg-[#D4AF37]/20 hover:bg-gradient-to-r hover:from-[#5D0F1D] hover:to-[#4A0E17] hover:text-[#D4AF37] transition-all duration-300 border border-[#D4AF37]/30 shadow-sm group-hover:shadow-md cursor-pointer">
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
