"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";

export default function AuthSidebar() {
    
    const {user,error, isLoading}=useUser()
    useEffect(()=>{
        if(!user) return
        fetch("/api/me")
    }, [user])
    if(isLoading) return <div>Loading...</div>
    
    return(
      <div className="flex flex-col items-center gap-3 border-t pt-4">

        
        {user?(
            <>
            
            <div className="flex items-center gap-4 w-full bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06]">
                <div className="p-[2px] rounded-full bg-gradient-to-br from-blue-400 to-violet-500">
                    <img
                        src={user.picture }
                        alt={user.name || "User"}
                        referrerPolicy="no-referrer"
                        className="w-11 h-11 rounded-full object-cover bg-slate-900 block"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-slate-400 text-xs truncate mt-0.5">{user.email}</p>
                </div>
            </div>
            <a
                href="/auth/logout"
                className="w-full text-center inline-block px-6 py-3 bg-white/[0.04] hover:bg-red-500/10  hover:text-red-400 font-medium rounded-2xl text-[15px] tracking-[-0.01em] border border-white/[0.08] hover:border-red-500/20 transition-all duration-200 focus:outline-none"
                >
            Sign out
            </a>
            </>
        ):
        <a
            href="/auth/login"
            className="w-full text-center inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-2xl text-[15px] tracking-[-0.01em] transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-px active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
            Sign in with Auth0
        </a>
        }
     </div>
    )
}