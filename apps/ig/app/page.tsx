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


type Post = {
  id: string;
  post_url: string;
  caption: string;
  created_at: string;
  file_type: string;
};

export default function Home(){
    const [isOpen, setIsOpen] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [commentsCount, setCommentsCount] = useState(0);
     const { user: currentUser } = useUser();
     const [dbUser, setDbUser] = useState(null);




    useEffect(() => {
  if (posts.length > 0) {
    setSelectedPost(posts[activeIndex]);
  }
}, [activeIndex, posts]);

const handleScroll = () => {
  const container = containerRef.current;
  if (!container) return;

  const index = Math.round(
    container.scrollTop / container.clientHeight
  );

  setActiveIndex(index);
};

    useEffect(() => {
  async function fetchPosts() {
    const res = await fetch("/api/reels")
    const posts = await res.json()
    
    setPosts(posts)
  }

  fetchPosts()
}, [])

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
                        <Feed post={post} dbUser={dbUser}  isActive={activeIndex === index} handleCommentClick={handleCommentClick} setSelectedPost={setSelectedPost}  />
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
            
        </div>
    )
}
