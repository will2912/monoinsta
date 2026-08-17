import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";


const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function Rootlayout({children}: {children: React.ReactNode}) {
    return (
        <html lang="en" className={cn("font-sans", geist.variable)}>
            <body>
                <div className="flex w-full h-screen">

                
                    <Sidebar />
                    <div className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
  {children}
</div>
                </div>
            </body>
        </html>
                     
        
        
    )
}