 "use client"
import Feed from "@/components/Feed";
import { Button } from "@/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useEffect,useState,useRef } from "react";
import CommentPannel from "@/components/commentPannel"
import { useUser } from "@auth0/nextjs-auth0/client";
import useFeed from "@/hooks/useFeed";
import { useSearchParams, useRouter } from "next/navigation";


type Post = {
  id: string;
  post_url: string;
  caption: string;
  created_at: string;
  file_type: string;
};

export default function Reel(){
    const [isOpen, setIsOpen] = useState(false);
   
const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [, setCommentsCount] = useState(0);
     const { user: currentUser } = useUser();
     const [dbUser, setDbUser] = useState(null);
    const {fetchFeed,isLoading,posts,hasMore,setPosts}= useFeed();
    const searchParmams = useSearchParams();
    const postId = searchParmams.get("post");
    const [isInitialized, setIsInitialized] = useState(false);
    const router =useRouter()


const handleScroll = () => {
  const container = containerRef.current;
  if (!container) return;

  const index = Math.round(
    container.scrollTop / container.clientHeight
  );

  setActiveIndex(index);
    
const el = containerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 200;

    if (isNearBottom && !isLoading&& hasMore) {
      fetchFeed();
    }
};

    useEffect(() => {/// initial effect
  if (postId) return;

  const loadFeed = async () => {
    await fetchFeed();
    setIsInitialized(true);
  };

  loadFeed();
}, []);

    useEffect(() => {
  if (!postId || isInitialized) return;

  const getPost = async () => {
    const res = await fetch(`/api/reels/${postId}`);
    const post = await res.json();

    setPosts([post]);
    setIsInitialized(true);
  };

  getPost();
}, [postId, isInitialized]);

useEffect(() => {
  const currPost = posts[activeIndex];

  if (!currPost) return;

  router.replace(`/reels?post=${currPost.id}`);
}, [activeIndex, posts]);

useEffect(() => {
  setSelectedPost(posts[activeIndex] ?? null);
}, [posts, activeIndex]);

useEffect(() => {
  if (!currentUser) return;

  async function getMe() {
    const res = await fetch("/api/me");
    const data = await res.json();
    setDbUser(data);
  }

  getMe();
}, [currentUser]);
    

const handleCommentClick = () => {
    setIsOpen(!isOpen);
}





    return (
        <div className="relative flex justify-center bg-[#060812] w-full h-screen ">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

            <div 
            ref={containerRef}
            onScroll={handleScroll}
            className=" h-screen w-full max-w-[390px] overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar   ">
            {
                posts.map((post, index) => (
                    
                    <div
                        key={post.id}
                        className="h-screen snap-start flex items-center py-4"
                    >
                        <Feed post={post} dbUser={dbUser}  isActive={activeIndex === index} handleCommentClick={handleCommentClick} setSelectedPost={setSelectedPost} isLoading={isLoading}  />
                    </div>
                                ))
            }
             
                
            </div>
            <CommentPannel isOpen={isOpen} setIsOpen={setIsOpen} selectedPost={selectedPost} setCommentsCount={setCommentsCount} setPost={setPosts} />

            <div className="absolute right-0 top-0 h-screen  flex flex-col items-center justify-center w-40 gap-14">
                <div>
                    <Button variant="ghost" className="w-10 h-10 rounded-full">
                        <ChevronUp size={28} />
                    </Button>
                </div>
                <div>
                    <Button variant="ghost" className="w-10 h-10 rounded-full">
                        <ChevronDown size={28} />
                    </Button>
                </div>
            </div>
            {isLoading && <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 text-white">Loading...</div>}
            
        </div>
    )
}
