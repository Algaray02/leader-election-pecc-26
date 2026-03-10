"use client";

import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function AdminVoteDistributionView() {
  const router = useRouter();
  const { stats, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-[#6B4F43] gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#4A0E17]" />
        <p className="font-bold text-lg animate-pulse">Loading vote distribution details...</p>
      </div>
    );
  }

  const distribution = stats?.voteDistribution || [];

  // Sort candidates by votes descending to have the leader on top
  const sortedDistribution = [...distribution].sort((a, b) => b.votes - a.votes);

  // Find the maximum vote count to scale the bars proportionally
  const maxVotes = sortedDistribution.length > 0 ? sortedDistribution[0].votes : 1;

  // Colors for the bars corresponding to the doughnut chart colors
  const chartColors = ['#5D0F1D', '#D4AF37', '#4A0E17', '#F7B757', '#8B6508'];

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto space-y-6 pt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-[#6B4F43] hover:text-[#4A0E17] transition-colors mb-4 text-sm font-bold tracking-wide uppercase group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> Back to Dashboard
          </button>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#4A0E17]">Vote Distribution Detail</h2>
          <p className="text-sm text-[#6B4F43] mt-1 font-medium">Detailed breakdown of candidate performance</p>
        </div>
      </div>

      <Card className="pt-0 shadow-xl shadow-blue-900/5 border border-[#D4AF37]/30 bg-[#FFFDF9]/95 backdrop-blur-sm overflow-hidden rounded-3xl">
        <CardHeader className="rounded-t-2xl bg-[#D4AF37]/5 border-b border-[#D4AF37]/20 py-6 px-8">
          <CardTitle className="text-xl font-bold text-[#4A0E17] flex items-center gap-2">
            Election Results Leaderboard
          </CardTitle>
          <p className="text-sm text-[#6B4F43]">Visualization of current vote counts scaled by volume.</p>
        </CardHeader>
        <CardContent className="p-8 pb-12">
           {sortedDistribution.length === 0 ? (
             <div className="text-center py-16 text-[#6B4F43]">
                <p>No candidates available or no votes recorded yet.</p>
             </div>
           ) : (
              <div className="flex flex-row items-end justify-center w-full gap-4 md:gap-8 pt-12">
                 {sortedDistribution.map((candidate: any, index: number) => {
               // Calculate the height percentage relative to the highest voted candidate
               const relativeHeight = maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;
               // Ensure there's a minimum visible height even with 0 votes for aesthetic
               const barHeight = Math.max(relativeHeight, 15);
               
               const color = chartColors[index % chartColors.length];

               return (
                 <div key={candidate.id} className="relative group w-full flex flex-col items-center justify-end h-80">
                    {/* Avatar block sitting on top of the bar */}
                    <div className="shrink-0 w-20 h-20 rounded-full bg-[#FFFDF9] p-1 shadow-xl border-4 border-white backdrop-blur-md z-20 relative -mb-6 md:-mb-8 transition-transform group-hover:-translate-y-2">
                      {candidate.imageUrl ? (
                         <>
                           {/* eslint-disable-next-line @next/next/no-img-element */}
                           <img src={candidate.imageUrl} alt={`${candidate.name} Profile`} className="w-full h-full object-cover rounded-full" />
                         </>
                      ) : (
                         <div className="w-full h-full bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
                             <User className="w-8 h-8 text-[#D4AF37]/60" />
                         </div>
                      )}
                      <div className="absolute top-0 right-0 -mt-1 -mr-1 w-6 h-6 bg-[#4A0E17] text-white rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                        {candidate.number}
                      </div>
                    </div>

                    {/* The dynamic growing vertical bar */}
                    <div 
                      className="w-full max-w-[5rem] md:max-w-[7rem] rounded-t-2xl shadow-inner relative flex flex-col items-center justify-start pt-8 md:pt-10 transition-all duration-1000 ease-out overflow-hidden"
                      style={{ height: `${barHeight}%`, backgroundColor: color }}
                    >
                       <span className="text-white font-black text-lg md:text-xl drop-shadow-md">{candidate.percentage}%</span>
                    </div>

                    {/* Information block at the bottom */}
                    <div className="text-center mt-3 h-16">
                       <h4 className="font-bold text-[#4A0E17] text-sm md:text-base leading-tight mb-1">{candidate.name}</h4>
                       <span className="font-black text-lg text-[#4A0E17]">{candidate.votes} <span className="text-xs font-semibold text-[#6B4F43]">Votes</span></span>
                    </div>
                 </div>
                 );
                 })}
              </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
