"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowRight, Lock, User, ShieldCheck, Sparkles, Globe, KeyRound, Eye, EyeOff } from "lucide-react";

export function LoginView() {
  const router = useRouter();
  const [nim, setNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        nim,
        password,
      });

      if (result?.error) {
        if (result.error === "ALREADY_VOTED") {
          toast.error("Access Denied", {
            description: "You have already cast your vote.",
          });
        } else {
          toast.error("Login Failed", {
            description: "Invalid NIM or password.",
          });
        }
      } else {
        toast.success("Login Success", {
          description: "Welcome!",
        });
        
        // Simple heuristic: If login is an admin, go back. Otherwise, go to voting page directly.
        if (nim.toLowerCase().includes("admin")) {
           router.push("/admin");
        } else {
           router.push("/vote");
        }
      }
    } catch (err) {
       toast.error("Error", {
          description: "An unexpected error occurred.",
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full font-serif bg-[#FDFBF7] text-[#4A0E17] selection:bg-[#D4AF37] selection:text-[#4A0E17]">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-[#5D0F1D] via-[#4A0E17] to-[#2D060C] border-r border-[#D4AF37]/50 relative overflow-hidden flex-col justify-between p-12 z-10 shadow-[inset_-20px_0_50px_rgba(0,0,0,0.4)]">
        {/* Ornate Background Glows */}
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-150 h-150 bg-[#D4AF37]/20 rounded-full blur-[120px] opacity-70 pointer-events-none mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-100 h-100 bg-[#75141C]/40 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
        
        {/* Subtle patterned background overlay (like Damask or Royal wallpaper) */}
        <div className="absolute inset-0 z-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(#D4AF37 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

        <div className="relative z-10 flex items-center space-x-4 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-16 h-16 bg-[#FDFBF7] rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)] border-b-4 border-[#D4AF37] relative overflow-hidden">
             <Image src="/images/logo/pecc_logo.png" alt="PECC Logo" fill className="object-contain p-2 hover:scale-105 transition-transform duration-500" />
           </div>
           <div>
              <h2 className="text-2xl font-black tracking-widest uppercase leading-tight text-[#D4AF37] drop-shadow-md">PECC</h2>
              <p className="text-[#FDFBF7]/80 text-sm font-sans font-bold tracking-wide flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#D4AF37]" /> 2025/2026
              </p>
           </div>
        </div>

        <div className="relative z-10 max-w-lg animate-in fade-in slide-in-from-left-8 duration-700 delay-200 pb-16">
          <div className="inline-block px-5 py-2 mb-6 rounded-full bg-[#3A0A11]/80 border border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md">
             <span className="text-[#D4AF37] font-sans font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                Leader Election 2026
             </span>
          </div>
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-playfair font-black leading-[1.1] mb-6 tracking-tight text-[#FDFBF7] drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            Empower Your Voice,<br />
            <span className="text-[#D4AF37] relative inline-block mt-2 pr-4 italic">
              Lead the Future.
              {/* Elegant underline */}
              <div className="absolute bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent -z-10"></div>
            </span>
          </h1>
          <p className="text-[#FDFBF7]/80 font-sans text-lg leading-relaxed font-light mt-4 drop-shadow-sm">
            Welcome to the official election system for the Polytechnic English Conversation Club 2026/2027. Log in to securely cast your vote and make an impact.
          </p>
        </div>

        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
           <div className="flex items-center space-x-4">
               <div className="flex space-x-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-[#FDFBF7] shadow-[0_0_10px_#FDFBF7] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-[#6B4F43] animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
               <span className="text-sm font-sans font-bold text-[#D4AF37] uppercase tracking-widest drop-shadow-sm">Make Your Choice Matter</span>
           </div>
        </div>
      </div>

      {/* Right Login Form Panel (Parchment/Cream Theme) */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative overflow-hidden bg-[#FDFBF7]">
        {/* Subtle royal pattern on the parchment */}
        <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#6B4F43 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-[#5D0F1D]/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-lg lg:max-w-xl relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-100">
           {/* Mobile header (hidden on desktop) */}
           <div className="lg:hidden mb-10 text-center flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#5D0F1D] to-[#2D060C] rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(93,15,29,0.3)] mb-5 border-b-4 border-[#D4AF37] relative overflow-hidden">
                <Image src="/images/logo/pecc_logo.png" alt="PECC Logo" fill className="object-contain p-4 brightness-[200%] contrast-[120%]" />
              </div>
              <h2 className="text-4xl font-playfair font-black text-[#4A0E17] tracking-tight drop-shadow-sm">PECC</h2>
              <p className="text-[#6B4F43] font-sans font-bold mt-2 flex items-center justify-center gap-1 uppercase tracking-widest text-sm">
                 <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Leader Election 2026
              </p>
           </div>

           {/* The Royal Decree Card */}
           <div className="rounded-3xl bg-gradient-to-b from-[#D4AF37] via-[#F7B757] to-[#8B6508] p-[3px] shadow-[0_30px_60px_-15px_rgba(74,14,23,0.3)] overflow-hidden">
             <Card className="border-0 shadow-none rounded-[1.35rem] overflow-hidden bg-[#FFFDF9] backdrop-blur-xl relative">
              {/* Inner subtle border line */}
              <div className="absolute inset-2 border border-[#D4AF37]/30 rounded-[1rem] pointer-events-none"></div>
              
              <CardHeader className="space-y-3 pt-10 px-8 lg:px-12 pb-6 border-b border-[#D4AF37]/20 relative z-10">
                 <CardTitle className="text-3xl font-playfair font-black text-[#4A0E17] tracking-tight flex items-center gap-3">
                    Welcome Officer and POI
                 </CardTitle>
                 <CardDescription className="text-md font-sans text-[#6B4F43] font-medium">
                    Sign in with your credentials to continue.
                 </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 lg:px-12 pt-8 pb-6 relative z-10">
                 <form onSubmit={handleLogin} className="space-y-7 font-sans">
                    <div className="space-y-2.5">
                       <Label htmlFor="nim" className="text-[#4A0E17] font-bold text-sm tracking-widest uppercase ml-1">NIM</Label>
                       <div className="relative group/input bg-white">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37] group-focus-within/input:text-[#eab919] transition-colors">
                             <User className="w-5 h-5" />
                          </div>
                          <Input
                             id="nim"
                             placeholder="e.g. 4.33.24.0.09"
                             required
                             value={nim}
                             onChange={(e) => setNim(e.target.value)}
                             className="border-2 h-14 rounded-xl border-[#D4AF37]/40 focus:border-[#D4AF37] bg-white text-[#4A0E17] text-base font-semibold pl-12 pr-4 transition-all hover:border-[#D4AF37]/60 placeholder:text-[#6B4F43]/50  focus:ring-4 focus:ring-[#D4AF37]/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                          />
                       </div>
                    </div>
                    <div className="space-y-2.5">
                       <div className="flex items-center justify-between ml-1">
                          <Label htmlFor="password" className="text-[#4A0E17] font-bold text-sm tracking-widest uppercase">Password</Label>
                       </div>
                       <div className="relative group/input">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#D4AF37] group-focus-within/input:text-[#eab919] transition-colors">
                             <KeyRound className="w-5 h-5" />
                          </div>
                          <Input
                             id="password"
                             type={showPassword ? "text" : "password"}
                             placeholder="••••••••"
                             required
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                             className="border-2 h-14 rounded-xl border-[#D4AF37]/40 focus:border-[#D4AF37] bg-white text-[#4A0E17] text-base font-semibold pl-12 pr-12 transition-all hover:border-[#D4AF37]/60 placeholder:text-[#6B4F43]/50 tracking-widest focus:ring-4 focus:ring-[#D4AF37]/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                          />
                          <button 
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#6B4F43]/40 hover:text-[#4A0E17] transition-colors"
                          >
                             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                       </div>
                    </div>
                    
                    <Button 
                       type="submit" 
                       className="w-full h-14 rounded-xl text-md font-bold bg-gradient-to-r from-[#5D0F1D] to-[#4A0E17] hover:from-[#75141C] hover:to-[#5D0F1D] text-[#D4AF37] border border-[#3A0A11] shadow-[0_10px_20px_-5px_rgba(93,15,29,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(93,15,29,0.5)] transition-all uppercase tracking-widest mt-10 flex items-center justify-center gap-3 relative group overflow-hidden cursor-pointer" 
                       disabled={loading}
                    >
                       <span className="relative z-10 flex items-center gap-2 drop-shadow-md">
                           {loading ? "Authenticating..." : (
                              <>Log In <Lock className="w-4 h-4 opacity-80 group-hover:opacity-100 transition-transform group-hover:scale-110" /></>
                           )}
                       </span>
                       <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                       {/* Button shimmer effect */}
                       <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"></div>
                    </Button>
                 </form>
              </CardContent>
              <CardFooter className="px-8 py-6 bg-[#FDFBF7] border-t border-[#D4AF37]/20 justify-center relative z-10">
                 <p className="text-xs font-sans text-[#6B4F43] font-bold uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                    Secured by PECC System
                 </p>
              </CardFooter>
             </Card>
           </div>
        </div>
      </div>
    </div>
  );
}