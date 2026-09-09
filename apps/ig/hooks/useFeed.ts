import { useState } from "react";

export default function useFeed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const url = cursor
        ? `/api/reels?cursor=${encodeURIComponent(cursor)}`
        : "/api/reels";

      const res = await fetch(url);
      const data = await res.json();

      // If API returned fewer than 10 posts,
      // there are no more posts after this.
      if (data.length < 10) {
        setHasMore(false);
      }

      setPosts((prev) => {
        const newPosts = data.filter(
          (p: any) => !prev.some((existing) => existing.id === p.id)
        );

        return [...prev, ...newPosts];
      });

      if (data.length > 0) {
        setCursor(data[data.length - 1].created_at);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    posts,
    fetchFeed,
    isLoading,
    hasMore,
    setPosts
  };
}