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
    <div className="flex min-h-screen w-full font-sans bg-white">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex w-[45%] bg-blue-50/30 border-r border-blue-100 relative overflow-hidden flex-col justify-between p-12 text-primary z-10">
        <div className="absolute top-0 right-0 -mt-32 -mr-32 w-150 h-150 bg-blue-100/50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-100 h-100 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center space-x-4 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-blue-200 relative overflow-hidden">
             <Image src="/images/logo/pecc_logo.png" alt="PECC Logo" fill className="object-contain p-2 hover:scale-105 transition-transform duration-500" />
           </div>
           <div>
              <h2 className="text-2xl font-black tracking-widest uppercase leading-tight text-blue-800">PECC</h2>
              <p className="text-blue-600/80 text-sm font-bold tracking-wide flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> 2025/2026
              </p>
           </div>
        </div>

        <div className="relative z-10 max-w-lg animate-in fade-in slide-in-from-left-8 duration-700 delay-200 pb-16">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white border border-blue-100 shadow-sm">
             <span className="text-primary font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                Leader Election 2026
             </span>
          </div>
          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] mb-6 tracking-tight text-blue-900">
            Empower Your Voice,<br />
            <span className="text-primary relative inline-block mt-2">
              Lead the Future.
              <div className="bottom-0 left-0 w-full h-3 bg-blue-200/60 -z-10 rounded-sm"></div>
            </span>
          </h1>
          <p className="text-blue-800/70 text-lg leading-relaxed font-semibold">
            Welcome to the official election system for the Polytechnic English Conversation Club 2026/2027. Log in to securely cast your vote and make an impact.
          </p>
        </div>

        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
           <div className="flex items-center space-x-4">
               <div className="flex space-x-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-blue-200 animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
               <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Make Your Choice Matter</span>
           </div>
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 lg:p-12 relative overflow-hidden">
        {/* Subtle patterned background */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#1d4ed8 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="w-full max-w-lg lg:max-w-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-100">
           {/* Mobile header (hidden on desktop) */}
           <div className="lg:hidden mb-8 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary/20 mb-5 border-b-4 border-blue-200 relative overflow-hidden">
                <Image src="/images/logo/pecc_logo.png" alt="PECC Logo" fill className="object-contain p-3" />
              </div>
              <h2 className="text-3xl font-black text-blue-800 tracking-tight">PECC</h2>
              <p className="text-primary font-bold mt-1 flex items-center justify-center gap-1">
                 <Sparkles className="w-4 h-4" /> Leader Election 2026
              </p>
           </div>

           <div className="rounded-3xl bg-linear-to-r from-blue-600 via-primary to-blue-400 p-0.75 shadow-2xl shadow-primary/10 overflow-hidden">
             <Card className="border-0 shadow-none rounded-[1.35rem]  overflow-hidden bg-white/90 backdrop-blur-xl">
              <CardHeader className="space-y-2 pt-4 px-8 lg:px-10 pb-6">
                 <CardTitle className="text-3xl font-black text-blue-900 tracking-tight flex items-center gap-3">
                    Welcome Officer and POI
                 </CardTitle>
                 <CardDescription className="text-md text-blue-600/70 font-semibold">
                    Sign in with your credentials to continue.
                 </CardDescription>
              </CardHeader>
              <CardContent className="px-10 lg:px-14">
                 <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2.5">
                       <Label htmlFor="nim" className="text-blue-900 font-bold text-md ml-1">NIM</Label>
                       <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                             <User className="w-5 h-5" />
                          </div>
                          <Input
                             id="nim"
                             placeholder="e.g. 4.33.24.0.09"
                             required
                             value={nim}
                             onChange={(e) => setNim(e.target.value)}
                             className="h-14 rounded-xl border-blue-200 focus:border-primary focus:ring-primary/20 bg-blue-50/50 text-base font-semibold pl-11 pr-4 transition-all hover:bg-blue-50 text-blue-950 placeholder:text-blue-300 shadow-sm"
                          />
                       </div>
                    </div>
                    <div className="space-y-2.5">
                       <div className="flex items-center justify-between ml-1">
                          <Label htmlFor="password" className="text-blue-900 font-bold text-md">Password</Label>
                       </div>
                       <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400">
                             <KeyRound className="w-5 h-5" />
                          </div>
                          <Input
                             id="password"
                             type={showPassword ? "text" : "password"}
                             placeholder="••••••••"
                             required
                             value={password}
                             onChange={(e) => setPassword(e.target.value)}
                             className="h-14 rounded-xl border-blue-200 focus:border-primary focus:ring-primary/20 bg-blue-50/50 text-base font-semibold pl-11 pr-12 transition-all hover:bg-blue-50 text-blue-950 placeholder:text-blue-300 tracking-widest shadow-sm"
                          />
                          <button 
                             type="button"
                             onClick={() => setShowPassword(!showPassword)}
                             className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-400 hover:text-blue-600 transition-colors"
                          >
                             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                       </div>
                    </div>
                    <Button 
                       type="submit" 
                       className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-blue-800 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 mt-6 group flex items-center justify-center gap-2 cursor-pointer" 
                       disabled={loading}
                    >
                       {loading ? "Authenticating..." : (
                          <>Log In <Lock className="w-5 h-5 transition-transform group-hover:scale-110" /></>
                       )}
                    </Button>
                 </form>
              </CardContent>
              <CardFooter className="px-8 py-6 bg-blue-50/50 border-t border-blue-100 justify-center">
                 <p className="text-sm text-primary font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
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
