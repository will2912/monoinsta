import { Button } from "@base-ui/react";
import AuthSidebar from "./authSidebar";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-white/10 bg-neutral-950 text-white">
      {/* LOGO */}
      <div className="px-6 py-8">
        <Button
          className="
            flex h-14 w-full items-center justify-start
            rounded-xl
            px-4
            text-2xl
            font-bold
            tracking-tight
            transition
            hover:bg-white/10
          "
        >
          <Link href="/">Instagram</Link>
        </Button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-1 flex-col gap-2 px-4">
        <Link href="/search" className="w-full" >
        <Button
          className="
          w-full
          
            flex h-14 items-center justify-start
            rounded-xl
            px-4
            text-base
            font-medium
            transition-all
            hover:bg-white/10
            active:scale-[0.98]
          "
        >
          Search
        </Button>
        </Link>

    
        <Link href="/upload" className="w-full" >
        <Button
          className="
          w-full
            flex h-14 items-center justify-start
            rounded-xl
            px-4
            text-base
            font-medium
            transition-all
            hover:bg-white/10
            active:scale-[0.98]
          "
        >
          upload
        </Button>
        </Link>

        <Link href="/profile" className="w-full" >
        <Button
          className="
          w-full
            flex h-14 items-center justify-start
            rounded-xl
            px-4
            text-base
            font-medium
            transition-all
            hover:bg-white/10
            active:scale-[0.98]
          "
        >
          Profile
        </Button>
        </Link>


        <Link href="/settings" className="w-full">
        <Button
          className="
            w-full
            flex h-14 items-center justify-start
            rounded-xl
            px-4
            text-base
            font-medium
            transition-all
            hover:bg-white/10
            active:scale-[0.98]
          "
        >
          Settings
        </Button>
        </Link>
      </nav>

      {/* USER */}
      <div className="border-t border-white/10 p-4">
        <AuthSidebar />
      </div>
    </aside>
  );
}