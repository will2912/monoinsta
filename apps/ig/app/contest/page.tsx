"use client";


import { Button } from "@/components/ui/button";
import { getUserId } from "@/service/user.service";
import { useUser } from "@auth0/nextjs-auth0/client";

import {
  CalendarDays,
  Clock3,
  Crown,
  Info,
  Medal,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Contest = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "open" | "calculating" | "completed";
  created_at: string;
};

export default function ContestPage() {
  const [contest, setContest] = useState<Contest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isNominate, setNominate ] = useState (true);
  const {user , isLoading: isUserLoading} = useUser();
  




  useEffect(() => {
  if (isUserLoading || !user || !contest) return;

  async function fetchIsNominated() {
    const userId = await getUserId(user.sub);

    const res = await fetch(
      `/api/contest_entries?userId=${userId}&contestId=${contest.id}`
    );
    const data = await res.json();
    setNominate(data);
    
    
  }

  fetchIsNominated();
}, [isUserLoading, user, contest,isNominate]);

  useEffect(()=>{
    async function fetchPosts() {
      const res= await fetch("api/profile");
      const data= await res.json();
      setMyPosts(data.posts);


    }
    fetchPosts();

  },[])

  useEffect(() => {
    async function fetchContest() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch("/api/contest", {
          cache: "no-store",
        });

        const result = await res.json();
        

        if (!res.ok) {
          throw new Error(result.error || "Failed to load contest");
        }

        // Supports both Response.json(data) and Response.json({ data })
        setContest(result.data ?? result);
        
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the contest"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchContest();
  }, []);


  const handleSelectPost = async () => {
  if (!selectedPost || !contest || !user) return;
  if(isNominate) return;

  try {
    const userId = await getUserId(user.sub);

    const res = await fetch("/api/contest_entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contestId: contest.id,
        userId,
        postId: selectedPost,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error);
    }

    setNominate(true);
  } catch (err) {
    console.error(err);
  }
};

  const formattedStartDate = useMemo(() => {
    if (!contest) return "";

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(contest.starts_at));
  }, [contest]);

  const formattedEndDate = useMemo(() => {
    if (!contest) return "";

    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(contest.ends_at));
  }, [contest]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#07080d] px-4 py-8 text-white sm:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-72 rounded-3xl bg-white/[0.05]" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-28 rounded-2xl bg-white/[0.05]"
              />
            ))}
          </div>

          <div className="h-96 rounded-3xl bg-white/[0.05]" />
        </div>
      </main>
    );
  }

  

  if (!contest) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07080d] px-4 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-white/[0.08] bg-white/[0.03] p-10 text-center">
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-violet-500/10">
            <Trophy className="size-8 text-violet-300" />
          </div>

          <h1 className="text-2xl font-semibold">No active contest</h1>

          <p className="mt-3 text-white/55">
            There is currently no open contest. The next weekly contest will
            appear here automatically.
          </p>
        </div>
      </main>
    );
  }

  //////////////////////

  return (
    <main className="min-h-screen  bg-[#07080d] text-white">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] max-w-full -translate-x-1/2 rounded-full bg-violet-600/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ContestHero
          contest={contest}
          formattedStartDate={formattedStartDate}
          formattedEndDate={formattedEndDate}
        />

        <ContestStats contest={contest} />

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 sm:p-7">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-300">
                    Your nomination
                  </p>

                  <h2 className="mt-1 text-2xl font-semibold">
                    Select one of your posts
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
                    You can nominate only one post in this contest. Once
                    nominated, the post cannot be used again in another contest.
                  </p>
                </div>

                <div className={`rounded-xl border border-amber-400/20 bg-amber-400/[0.07] px-3 py-2 text-xs text-amber-200 ${selectedPost? "bg-green-500":'' }`}>
                  <Button onClick={handleSelectPost}>
                      {isNominate ? `nominated` : 'Select Post'}
                  </Button>
                </div>
              </div>

              

              <div className="min-h-[340px] rounded-2xl border border-dashed border-white/[0.12] bg-black/20 p-6">
                <div className=" h-[200px] min-h-[290px]   grid grid-cols-3 gap-3 text-white/50 overflow-y-auto rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    {/* Your posts will be displayed here */}
                    {myPosts?.map((post) => (
                      <div key={post.id} 
                        onClick={() => setSelectedPost(post.id)}
                          className={`cursor-pointer rounded-xl border p-4 transition-all border border-white/10 bg-white/5 p-4 rounded-xl
                            ${
                              selectedPost === post.id
                                ? "border-green-500 ring-2 ring-green-500/30"
                                : "border-white/10 bg-white/5 hover:border-white/30"
                            }`}
                      >
                          {post.file_type === "image" ? (
                          <img
                            src={post.post_url}
                            alt={post.caption || "Post"}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <video
                            src={post.post_url}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                            muted
                          />
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </section>

            
          </div>

          <aside className="space-y-6">
            <ContestRules />
            <RankingInfo />
          </aside>
        </section>
      </div>
    </main>
  );
}

function ContestHero({
  contest,
  formattedStartDate,
  formattedEndDate,
}: {
  contest: Contest;
  formattedStartDate: string;
  formattedEndDate: string;
}) {
  return (
    <section className="relative  rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-violet-600/20 via-white/[0.04] to-blue-600/10 p-6 sm:p-9">
      <div className="absolute -right-20 -top-20 size-64 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1.5 text-sm text-emerald-300">
            <span className="size-2 animate-pulse rounded-full bg-emerald-400" />
            {contest.status === "open" ? "Live contest" : contest.status}
          </div>

          <div className="flex items-start gap-4">
            <div className="hidden size-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
              <Crown className="size-8 text-yellow-300" />
            </div>

            <div>
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-violet-300">
                Weekly creator challenge
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                {contest.title}
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/55 sm:text-base">
                Nominate your strongest post and compete for a place in the
                weekly top 50 leaderboard.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
          <DateCard
            icon={<CalendarDays className="size-5" />}
            label="Starts"
            value={formattedStartDate}
          />

          <DateCard
            icon={<Clock3 className="size-5" />}
            label="Ends"
            value={formattedEndDate}
          />
        </div>
      </div>
    </section>
  );
}

function DateCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-black/20 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-white/45">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>

      <p className="mt-3 text-sm font-medium text-white/85">{value}</p>
    </div>
  );
}

function ContestStats({ contest }: { contest: Contest }) {
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Trophy className="size-5" />}
        label="Contest status"
        value={contest.status}
      />

      <StatCard
        icon={<Medal className="size-5" />}
        label="Leaderboard"
        value="Top 50"
      />

      <StatCard
        icon={<Users className="size-5" />}
        label="Nomination limit"
        value="1 post"
      />

      <StatCard
        icon={<Clock3 className="size-5" />}
        label="Contest cycle"
        value="Weekly"
      />
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5">
      <div className="flex items-center justify-between">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
          {icon}
        </div>

        <span className="size-2 rounded-full bg-emerald-400" />
      </div>

      <p className="mt-5 text-sm text-white/40">{label}</p>
      <p className="mt-1 capitalize font-semibold">{value}</p>
    </div>
  );
}

function ContestRules() {
  const rules = [
    "You can nominate only one post.",
    "A previously used post cannot participate again.",
    "Ratings received before and during the contest count.",
    "Ratings after the deadline do not affect final results.",
  ];

  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10">
          <Info className="size-5 text-blue-300" />
        </div>

        <div>
          <p className="text-sm text-white/40">Before you nominate</p>
          <h2 className="font-semibold">Contest rules</h2>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {rules.map((rule, index) => (
          <div key={rule} className="flex gap-3">
            <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-xs text-white/60">
              {index + 1}
            </div>

            <p className="text-sm leading-6 text-white/55">{rule}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function RankingInfo() {
  return (
    <section className="rounded-3xl border border-violet-400/15 bg-violet-500/[0.06] p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15">
          <Sparkles className="size-5 text-violet-300" />
        </div>

        <div>
          <p className="text-sm text-violet-300">Fair ranking</p>
          <h2 className="font-semibold">How ranking works</h2>
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-white/55">
        Ranking considers both your post average and the number of ratings it
        has received. Posts with only a few ratings are balanced against the
        overall contest average.
      </p>
    </section>
  );
}

