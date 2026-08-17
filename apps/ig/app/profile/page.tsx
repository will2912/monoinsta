"use client"
import Pagination from "@/components/pagination";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
    const { user,isLoading } = useUser();
    const [posts, setPosts] = useState([]);
    const [currentPosts, setCurrentPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    

      useEffect(() => {
  if (isLoading || !user) return;

  async function fetchMyPosts() {
    const res = await fetch("/api/profile");
    const data = await res.json();
    setPosts(data.posts || []);
  }

  fetchMyPosts();
}, [user, isLoading]);

useEffect(() => {
  const start = (currentPage - 1) * 9;
  const end = start + 9;

  setCurrentPosts(posts.slice(start, end));
}, [posts, currentPage]);

    return (
        <div className="flex flex-col w-full h-full px-6 py-6 overflow-y-auto">
            <div className=" w-full h-[30%] mx-auto max-w-5xl flex items-center gap-4" >
                <img 
                    src={user?.picture}
                    alt={user?.name || "User"}
                    referrerPolicy="no-referrer"
                    className="w-28 h-28 object-contain rounded-full"
                />
                          <div className="flex-1">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <h1 className="text-2xl font-semibold">
                {user?.name || "Unknown User"}
              </h1>

              <button className="w-fit rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20">
                Edit Profile
              </button>
            </div>

            {/* STATS */}
            <div className="mt-5 flex gap-8 text-sm">
              <div>
                <span className="font-semibold">{posts.length}</span> posts
              </div>
              <div>
                <span className="font-semibold">0</span> followers
              </div>
              <div>
                <span className="font-semibold">0</span> following
              </div>
            </div>

            <p className="mt-4 text-sm text-white/70">
              {user?.email}
            </p>

            <p className="mt-2 max-w-xl text-sm ">
              Bio will appear here later. Add bio, website, location, and profile
              customization when your user table supports it.
            </p>
          </div>

            </div>
            <div className=" w-full flex-1  " >
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={Math.ceil(posts.length / 9)} onPageChange={setCurrentPage} currentPosts={currentPosts} />
            </div>
        </div>
    )
}