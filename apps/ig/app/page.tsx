"use client";

import Thumbnail from "@/components/Thumbnail";
import { useEffect, useRef } from "react";
import { Flame } from "lucide-react";
import useFeed from "@/hooks/useFeed";

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { fetchFeed, posts, isLoading ,hasMore} = useFeed();

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 200;

    if (isNearBottom && !isLoading&& hasMore) {
      fetchFeed();
    }
  };

  return (
    <div className="relative bg-[#060812] w-full min-h-screen">

      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* THIS is the scrollable container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen overflow-y-auto"
      >

        <div className="w-full p-5">

          {/* Header */}
          <div className="flex">
            <Flame className="text-orange-400" />

            <h1 className="text-2xl font-bold text-white">
              Trending
            </h1>
          </div>

          <div className="mt-4 h-px bg-gradient-to-r from-orange-500/40 via-white/10 to-transparent" />

          {/* Posts */}
          <div className="w-full grid grid-cols-3 gap-4 mt-3">
            {posts.map((post) => (
              <Thumbnail key={post.id} post={post} />
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-white/30 border-t-white" />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}