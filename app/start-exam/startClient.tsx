'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { UserCircle2, Play } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/app/lib/auth-client";

export default function StartClient( ) {
    const { data: session, isPending } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const examTitle = "Preliminary Round";
    const user = session?.user;
    
    const handleStart = async () => {
        setIsLoading(true);
        router.push('/exam');
    };

    return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <Card className="max-w-md w-full shadow-xl border-slate-200">
        <CardContent className="pt-12 pb-8 flex flex-col items-center text-center space-y-6">
          
          {/* User Placeholder */}
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-2 ring-4 ring-white shadow-lg">
             <UserCircle2 className="w-16 h-16 text-blue-600" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">Halo, {user?.name}</h2>
            <p className="text-slate-500 text-sm">{user?.email}</p>
          </div>

          <div className="bg-slate-50 px-8 py-4 rounded-2xl border border-slate-100 w-full">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">STEM</p>
             <p className="text-slate-800 font-bold text-lg">{examTitle}</p>
          </div>

        </CardContent>

        <CardFooter className="p-8 pt-0">
          <Button 
            size="lg" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 shadow-lg shadow-blue-200 transition-transform hover:scale-[1.02]"
            onClick={handleStart}
            disabled={isLoading}
          >
            {isLoading ? "Memproses..." : (
              <>
                Masuk ke Ujian <Play className="w-4 h-4 ml-2 fill-current" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
    )
};