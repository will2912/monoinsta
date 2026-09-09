"use client"
import { useRouter } from "next/navigation"

export default function Thumbnail({post}:any) {
  const router = useRouter();

  const handleClick = async()=>{
     router.push(`/reels?post=${post.id}`)
  }

  return (
    <div className="w-full " onClick={handleClick} >
      <div className="w-full aspect-video overflow-hidden rounded-xl">
       { post.file_type==="video"?(
        <video
        src={post.post_url}
        className="w-full h-full object-cover"
        preload="metadata"
        muted
        />
       ):
        <img
          src={post.post_url}
          className="w-full h-full object-cover"
          alt="Video thumbnail"
        />}
      </div>

      <div className="flex gap-3 mt-3">
        <img
          src={post.users.avatar_url}
          className="w-10 h-10 rounded-full object-cover shrink-0"
          alt="User"
        />
        <div className="min-w-0">
          <h3 className="font-semibold text-white line-clamp-2">
           {post.caption}
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            {post.users?.username}
          </p>

          <p className="text-sm text-gray-400">
            1.2M views • 2 days ago
          </p>
        </div>

      </div>

    </div>
  )
}