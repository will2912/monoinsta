import { Button } from "@base-ui/react";
import AuthSidebar from "./authSidebar";
import Link from "next/link";
import {Home,Search,Compass,Video,Plus,Trophy,User,Settings,Sparkles,} from "lucide-react";


const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Search",
    href: "/search",
    icon: Search,
  },
  {
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Reels",
    href: "/reels",
    icon: Video,
  },
];


export default function Sidebar() {
  return (
    <aside className="flex overflow-y-auto h-screen w-64 flex-col border-r border-white/[0.08] bg-[#08090d] text-white no-scrollbar">
      <div className="pointer-events-none absolute left-0 top-0 h-48 w-full bg-violet-600/10 blur-3xl" />
      {/* LOGO */}
      <div className="relative px-5 pt-7 pb-8">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-2xl px-3 py-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20 transition-transform duration-300 group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              YourApp
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
              Create · Rate · Compete
            </p>
          </div>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-1 flex-col gap-2 px-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group flex h-12 w-full items-center gap-3
                  rounded-xl px-3
                  text-sm font-medium text-white/60
                  transition-all duration-200
                  hover:bg-white/[0.06] hover:text-white
                "
              >
                <Icon className="h-[19px] w-[19px] transition-transform duration-200 group-hover:scale-105" />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="my-6 h-px bg-white/[0.06]" />

        <Link
          href="/upload"
          className="
            group flex h-12 items-center gap-3
            rounded-xl px-3
            bg-gradient-to-r from-violet-600/20 to-indigo-600/10
            border border-violet-500/20
            text-sm font-semibold
            transition-all duration-200
            hover:border-violet-400/40
            hover:from-violet-600/30
            hover:to-indigo-600/20
          "
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500 shadow-md shadow-violet-500/20">
            <Plus className="h-4 w-4 text-white" />
          </div>

          <span>Create Post</span>
        </Link>

         <Link
          href="/contest"
          className="
            group mt-3 flex items-center gap-3
            rounded-xl px-3 py-3
            transition-all duration-200
            hover:bg-amber-400/[0.06]
          "
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/10">
            <Trophy className="h-[18px] w-[18px] text-amber-400" />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-white/80">
              Weekly Contest
            </span>
            <span className="text-[11px] text-white/30">
              Compete & climb the ranks
            </span>
          </div>
        </Link>

        <div className="mt-auto pb-4">

          <div className="mb-3 h-px bg-white/[0.06]" />

          <Link
            href="/profile"
            className="
              group flex h-11 items-center gap-3
              rounded-xl px-3
              text-sm font-medium text-white/55
              transition hover:bg-white/[0.06] hover:text-white
            "
          >
            <User className="h-[18px] w-[18px]" />
            Profile
          </Link>

          <Link
            href="/settings"
            className="
              group flex h-11 items-center gap-3
              rounded-xl px-3
              text-sm font-medium text-white/55
              transition hover:bg-white/[0.06] hover:text-white
            "
          >
            <Settings className="h-[18px] w-[18px]" />
            Settings
          </Link>

        </div>
        

      </nav>

      {/* USER */}
      <div className="border-t border-white/10 p-4">
        <AuthSidebar />
      </div>
    </aside>
  );
}