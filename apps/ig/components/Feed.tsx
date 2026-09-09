import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import RatingSlider from "./RatingSlider";

export default function Feed({ post , isActive, handleCommentClick,  dbUser, isLoading }: any) {
    const user = post.users;
    const audioRef = useRef<HTMLAudioElement>(null);
    
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes.length);
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    
    



const myRating = post.ratings.find(
  (r: any) => r.user_id === dbUser?.id
)?.rating ?? null;

const averageRating =
  post.ratings.length === 0
    ? 0
    : post.ratings.reduce((sum:any, r:any) => sum + r.rating, 0) /
      post.ratings.length;


useEffect(() => {
  if (!dbUser?.id) return;

  setIsLiked(
    post.likes.some(
      (like:any) => like.user_id === dbUser.id
    )
  );
}, [dbUser?.id, post.likes]);



    useEffect(() => {
        
  if (!audioRef.current) return;

  if (isActive) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  } else {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }
}, [isActive]);

useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  if (isActive) {
    video.play().catch(() => {});
  } else {
    video.pause();
    video.currentTime = 0;
  }
}, [isActive]);

const handleAudioPlay = () => {
    console.log("handleAudioPlay called");
    if (!audioRef.current) return;

  if (audioRef.current.paused) {
    audioRef.current.play().catch(() => {});
  } else {
    audioRef.current.pause();
  }
}



const handleLike=async()=>{
    fetch("/api/like",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            post_id:post.id,
            user_id:dbUser?.id
        })
    })
    
    setLikesCount((prevCount:any) => isLiked ? prevCount - 1 : prevCount + 1);
    setIsLiked(!isLiked);
    
}

const handleVideoClick = ()=>{
    setIsMuted((prev) => !prev);
    
}

const handleRating = async (rating: number) => {
  if (!dbUser?.id) return;

  try {
    const response = await fetch("/api/rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: post.id,
        user_id: dbUser.id,
        rating,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to save rating");
    }

    console.log("Rating saved:", data);
  } catch (error) {
    console.error("Rating error:", error);
  }
};
    
    return (
  <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-black text-white">
    {/* CONTENT */}
    <div className="h-full w-full">
      {post.file_type?.startsWith("image") ? (
        <img
          src={post.post_url}
          alt="Post"
          className="h-full w-full object-contain"
        />
      ) : (
        <video
          onClick={handleVideoClick}
          ref={videoRef}
          src={post.post_url}
          className="h-full w-full cursor-pointer object-contain"
          muted={isMuted}
          loop
          playsInline
        />
      )}
    </div>

    {/* BOTTOM DARK GRADIENT */}
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

    {/* CAPTION AND USER INFORMATION */}
    <div className="absolute bottom-4 left-4 right-4 z-10 space-y-3 ">
      <div className="flex items-center gap-2 font-semibold">
        <img
          src={user?.avatar_url || "/default-avatar.png"}
          alt={user?.username || "User"}
          className="h-10 w-10 rounded-full border border-white/40 object-cover"
        />

        <p className="truncate">
          {user?.username || "Unknown user"}
        </p>

        <button className="rounded-lg border border-white/70 px-3 py-1 text-xs">
          Follow
        </button>
      </div>

      {post.caption && (
        <div className="line-clamp-2 text-sm">
          {post.caption}
        </div>
      )}

      {/* MUSIC */}
      <div className="flex w-full items-center justify-between gap-2 text-xs text-white/85 ">
        <div className="min-w-0 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
          <p className="truncate">
            <span>♪ </span>

            {post.music_title
              ? `${post.music_artist} - ${post.music_title}`
              : "Original audio"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAudioPlay}
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/40 bg-black/60 transition active:scale-90"
        >
          <img
            src={
              post.music_cover_url ||
              user?.avatar_url ||
              "/default-avatar.png"
            }
            alt="Music disc"
            className="h-full w-full object-cover"
          />

          {post.music_audio_url && (
            <audio
              ref={audioRef}
              src={post.music_audio_url}
              loop
            />
          )}
        </button>
      </div>
    </div>

    {/* ACTIONS */}
    <div className="absolute bottom-24 right-3 z-20 p-2">
      <div className="relative flex flex-col gap-5">
            <RatingSlider
      initialRating={myRating}
  averageRating={averageRating}
      onRatingChange={handleRating}
    />
        {/* LIKE */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleLike}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 transition hover:bg-black/50 active:scale-90"
          >
            <Heart
              size={28}
              className={
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-white"
              }
            />
          </button>

          <span className="text-sm">{likesCount}</span>
        </div>

        {/* COMMENT */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleCommentClick}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 transition hover:bg-black/50 active:scale-90"
          >
            <MessageCircle size={28} />
          </button>

          <span className="text-sm">
            {post.comments_count || 0}
          </span>
        </div>

        {/* SHARE */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 transition hover:bg-black/50 active:scale-90"
          >
            <Share size={28} />
          </button>

          <span className="text-sm">Share</span>
        </div>

        {/* SAVE */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 transition hover:bg-black/50 active:scale-90"
        >
          <Bookmark size={28} />
        </button>
      </div>
    </div>
  </div>
);
}