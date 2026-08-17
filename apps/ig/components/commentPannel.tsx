import { Component, useEffect, useState } from "react"
import {Input} from "./ui/input"
import { Button } from "./ui/button"
import { X } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserId } from "../service/user.service";
export default function CommentPannel({isOpen, setIsOpen, selectedPost, setCommentsCount, setPost}: any) {

    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const {user} =useUser();
    async function fetchComments() {

        

        const res = await fetch(`/api/comments?post_id=${selectedPost.id}`
        
    )

        const data = await res.json();
        setComments(data);
}
    
    useEffect(() => {

         if (!isOpen || !selectedPost) return;
        

    fetchComments();
    }, [isOpen, selectedPost]);

    const handlePostComment = async()=>{
        console.log(user?.sub)

         const res = await fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                post_id: selectedPost.id,
                user_id: await getUserId(user?.sub), // Replace with actual user ID
                content: content, // Replace with actual comment content
            })
        });
        if (res.ok) {
             await fetchComments();
        setContent("");
        setPost(prev =>
        prev.map(post =>
            post.id === selectedPost.id
            ? {
          ...post,
          comments_count: post.comments_count + 1,
        }
      : post
  )
);;
        }
           
    }

    


    return(
        <div className={`fixed right-0 top-0 w-[300px] h-screen bg-gray-800 text-white z-50 ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
            {isOpen && (
                <div className="flex flex-col p-4 h-screen  ">
                    <div className="h-12 border-b border-gray-700 flex  justify-between">
                        
                        <h1>Comments</h1>
                        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto  no-scrollbar">
                        {comments.map((comment)=>(
                            <p key={comment.id} className="p-2 border-b border-gray-700 flex items-center gap-2">
                                <span >
                                    <img src={comment.users.avatar_url} alt={comment.users.username} className="w-8 h-8 rounded-full" />
                                </span>
                                <span className="font-bold">{comment.users.username}: </span>
                                {comment.content}
                            </p>  
                        ))}
                    </div>
                    <div className="h-12 flex items-center">
                        <Input placeholder="Write a comment..." value={content} onChange={(e)=> setContent(e.target.value)} />
                        <Button variant="ghost" className="ml-2" onClick={handlePostComment}>
                            post
                        </Button>
                    </div>
                </div>
                
            )}
        </div>
    )
}
