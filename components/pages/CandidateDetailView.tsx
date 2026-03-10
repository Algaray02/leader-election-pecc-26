"use client";

import { Button } from "@/components/ui/button";
import { useVoterCandidate, useSubmitVote } from "@/hooks/useVoter";
import { Loader2, ArrowLeft, CheckCircle2, Eye, Flag, Info, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

export function CandidateDetailView({ candidateId }: { candidateId: string }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: candidate, isLoading } = useVoterCandidate(candidateId);
  
  const submitVoteMutation = useSubmitVote();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleVote = async () => {
    submitVoteMutation.mutate(candidateId, {
      onSuccess: () => {
        toast.success("Vote Cast Successfully", { description: "Your vote has been recorded."});
        router.push("/vote/success");
      },
      onError: (err: any) => {
        toast.error("Failed to Vote", {
          description: err?.response?.data?.message || err.message || "An unexpected error occurred."
        });
      }
    });
  };

  if (isLoading || !candidate) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[60vh] text-slate-500 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="font-bold text-lg animate-pulse">Loading profile...</p>
      </div>
    );
  }

  const cNumber = String(candidate.candidateNumber).padStart(2, '0');
  const cName = candidate.name;
  const missions = (candidate.mission || "").split('\n').filter((m: string) => m.trim() !== "");

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center text-slate-500 hover:text-primary transition-colors mb-4 text-sm font-bold tracking-wide uppercase group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> Back to Selection
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-blue-50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-118 md:h-64 lg:h-56 bg-primary z-0 overflow-hidden">
           {/* Abstract pattern over gradient */}
           <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
           <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
           <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/30 rounded-full blur-[80px]"></div>
        </div>
        
        <div className="relative z-10 px-8 lg:px-12 pb-12">
          <div className="flex flex-col md:flex-row items-center md:items-end md:gap-8 mt-4 mb-2 md:mb-12">
             <div className="relative group mt-8 md:mt-0">
                <div className="w-48 h-48 rounded-[2rem] bg-white p-2 shadow-2xl rotate-0 transition-transform duration-500 group-hover:-rotate-3 border-4 border-white/50 backdrop-blur-md overflow-hidden flex items-center justify-center relative">
                   {candidate.imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={candidate.imageUrl} alt={`${cName} Profile`} className="w-full h-full object-cover rounded-xl" />
                   ) : (
                      <div className="w-full h-full bg-blue-50/50 rounded-2xl flex items-center justify-center">
                          <User className="w-20 h-20 text-blue-200" />
                      </div>
                   )}
                </div>
                <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl border-4 border-blue-100 transform rotate-6">
                   {cNumber}
                </div>
             </div>
             
             <div className="flex-1 text-center md:text-left mt-6 md:mt-0 pt-16 md:pt-0">
               <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-black tracking-widest uppercase mb-3 border border-white/30 shadow-sm">
                 Leader Candidate
               </span>
               <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-2 drop-shadow-md tracking-tight">
                 {cName}
               </h1>
               <p className="text-blue-100 text-lg font-medium tracking-wide">{candidate.major || "Polytechnic Student"}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20 md:mt-0">
             <div className="lg:col-span-2 space-y-10">
                <section>
                   <div className="flex items-center gap-4 mb-5">
                      <div className="p-3 bg-blue-50 rounded-2xl text-primary shadow-sm border border-blue-100">
                         <Eye className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vision</h3>
                   </div>
                   <div className="bg-white rounded-[2rem] p-8 border border-blue-50 text-slate-600 leading-relaxed text-xl italic relative shadow-sm">
                      "{candidate.vision}"
                   </div>
                </section>
                
                <section>
                   <div className="flex items-center gap-4 mb-5">
                      <div className="p-3 bg-blue-50 rounded-2xl text-primary shadow-sm border border-blue-100">
                         <Flag className="w-6 h-6" />
                      </div>
                      <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mission</h3>
                   </div>
                   <ul className="space-y-4">
                      {missions.map((m: string, i: number) => (
                         <li key={i} className="flex items-start gap-5 p-6 rounded-[1.5rem] border border-blue-50 bg-white hover:bg-blue-50/30 hover:shadow-md hover:border-blue-100 transition-all duration-300">
                            <span className="shrink-0 w-10 h-10 rounded-2xl bg-blue-50 text-primary flex items-center justify-center font-black text-lg shadow-sm border border-blue-100">{i+1}</span>
                            <p className="text-slate-700 pt-1.5 text-lg font-medium leading-relaxed">{m.replace(/^\d+\.\s*/, '')}</p>
                         </li>
                      ))}
                   </ul>
                </section>
             </div>

             <div className="lg:col-span-1">
               <Card className="sticky top-8 rounded-[2rem] overflow-hidden border border-slate-100 shadow-xl hover:shadow-xl hover:shadow-blue-400 hover:-translate-y-1 transition-all duration-600">
                   <div className="p-8 bg-white">
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Cast Your Vote</h3>
                      <p className="text-slate-500 text-sm mb-8 font-medium leading-relaxed">
                         Please confirm your choice. This action cannot be undone once submitted.
                      </p>
                      
                      <div className="mb-8 p-5 bg-blue-50 rounded-2xl border border-blue-100 w-full flex items-start gap-4 shadow-sm">
                         <Info className="text-primary w-6 h-6 shrink-0 mt-0.5" />
                         <p className="text-sm text-blue-900 font-medium leading-relaxed">
                            You are about to cast your official vote for <strong className="font-black text-primary block mt-1 text-base">Candidate #{cNumber} - {cName}</strong>
                         </p>
                      </div>

                      <div className="space-y-4">
                         <Button 
                            onClick={handleVote} 
                            disabled={submitVoteMutation.isPending}
                            className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-blue-800 text-white transition-all hover:-translate-y-1 group cursor-pointer"
                         >
                            {submitVoteMutation.isPending ? (
                              <>
                                <Loader2 className="w-6 h-6 mr-3 animate-spin" /> PROCESSING...
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-6 h-6 mr-3 transition-transform group-hover:scale-110" /> CONFIRM VOTE
                              </>
                            )}
                         </Button>
                         <Button 
                            variant="outline" 
                            onClick={() => router.back()}
                            className="w-full h-16 rounded-2xl font-bold border-2 border-blue-100 text-slate-600 hover:bg-blue-50 hover:text-primary transition-colors hover:border-blue-200 cursor-pointer"
                         >
                            Cancel
                         </Button>
                      </div>
                      <div className="mt-8 text-center flex items-center justify-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-primary"></div>
                         <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">
                           PECC System © 2026
                         </p>
                      </div>
                   </div>
                </Card>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
