
"use client"
import supabase from "@/lib/supabase";
import { useState, useEffect } from "react";

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [contest, setContest] = useState();
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchLeaderboard() {
    // 1. Get current contest
    const contestRes = await fetch("/api/contest");
      const contestResult = await contestRes.json();

      if (!contestRes.ok) {
        throw new Error(
          contestResult.error || "Failed to fetch contest"
        );
      }

      const currContest = contestResult.data ?? contestResult;

      if (!currContest?.id) {
          setContest(null);
          setLeaderboard([]);
          return;
        }

        setContest(currContest);
    

    // 2. Get leaderboard
    const res = await fetch(
      `/api/contest/leaderboard?contestId=${currContest?.id}`
    );

    const data = await res.json();
    console.log(data)

    setLeaderboard(data.entries);
    
    setLoading(false);
  }

  fetchLeaderboard();
}, []);


useEffect(() => {
  if (!contest?.id) return;

  const channel = supabase
    .channel(`contest:${contest.id}`)
    .on(
      "broadcast",
      { event: "leaderboard_updated" },
      ({ payload }) => {
        setLeaderboard(payload.entries ?? []);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [contest?.id]);
  

  return (
    <div className="min-h-screen bg-[#07080d] text-white p-8">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-violet-400 text-sm font-medium">
              Weekly Contest
            </p>

            <h1 className="text-4xl font-bold mt-1">
              Live Leaderboard
            </h1>

            <p className="text-white/50 mt-2">
              Rankings update automatically as users rate nominated posts.
            </p>
          </div>

          <div className="rounded-full bg-emerald-500/10 px-4 py-2 text-emerald-300 text-sm">
            ● Live
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10">

          <div className="grid grid-cols-5 bg-white/5 px-6 py-4 text-sm text-white/50 font-medium">
            <div>Rank</div>
            <div className="col-span-2">Creator</div>
            <div className="text-center">Ratings</div>
            <div className="text-right">Score</div>
          </div>

          {leaderboard.map((entry) => (
  <div
    key={entry.entry_id}
    className="grid grid-cols-5 items-center border-t border-white/5 px-6 py-5"
  >
    <div>{entry.rank}</div>

    <div className="col-span-2">
      <p className="font-semibold">
        User: {entry.user_id.slice(0, 8)}
      </p>

      <p className="text-sm text-white/40">
        Average {entry.post_average}
      </p>
    </div>

    <div className="text-center">
      {entry.rating_count}
    </div>

    <div className="text-right font-semibold text-violet-300">
      {entry.ranking_score}
    </div>
  </div>
))}

        </div>
      </div>
    </div>
  );
}