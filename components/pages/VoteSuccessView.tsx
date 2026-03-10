"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function VoteSuccessView() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown <= 0) {
      signOut({ callbackUrl: '/' });
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);
  return (
    <div className="flex h-[calc(100vh-8rem)] w-full items-center justify-center">
      <Card className="w-full max-w-lg shadow-2xl border-blue-50 bg-white rounded-[2.5rem] text-center relative overflow-hidden py-10 px-4">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <CardHeader className="space-y-6 pt-8 relative z-10 flex flex-col items-center">
          <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-gradient-to-br from-green-400 to-green-500 text-white shadow-xl shadow-green-500/30 transform transition-transform hover:scale-110 duration-500 border-4 border-white">
            <CheckCircle2 className="w-14 h-14" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-4xl font-extrabold tracking-tight text-slate-900">Vote Submitted!</CardTitle>
            <CardDescription className="text-lg text-slate-500 font-medium px-4">
              Thank you for participating. Your vote has been securely recorded in our system.
            </CardDescription>
          </div>
        </CardHeader>
          <CardContent className="pb-8 relative z-10 flex flex-col items-center">
            <div className="mt-6 w-full p-6 bg-blue-50 rounded-2xl text-blue-900 border border-blue-100 mb-10 shadow-inner flex flex-col items-center justify-center gap-2">
              <p className="font-semibold text-sm leading-relaxed">
                Thank you for your participation! You will be automatically logged out in:
              </p>
              <div className="text-4xl font-black text-primary animate-pulse">{countdown}s</div>
            </div>
            
            <Button 
               onClick={() => signOut({ callbackUrl: '/' })}
               className="w-[80%] h-16 rounded-2xl font-bold bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-500/20 transition-all duration-300 hover:-translate-y-1 text-lg group cursor-pointer" 
               size="lg"
            >
              <LogOut className="w-6 h-6 mr-3 -ml-2 group-hover:-translate-x-1 transition-transform" /> Log Out Now
            </Button>
          </CardContent>
      </Card>
    </div>
  );
}
