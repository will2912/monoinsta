import { NextResponse } from "next/server";

import { auth0 } from "@/lib/auth0";
import supabase from "@/lib/supabase";
import { getUserId } from "@/service/user.service";

export async function GET() {
  try {
    // ✅ get logged in user
    console.log("PROFILE POSTS API: GET /api/profile");
    const session = await auth0.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const auth0Id = session.user.sub;
    const userId = await getUserId(auth0Id);

    // ✅ fetch user posts
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        likes:likes(count)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    // ✅ transform posts
    const formattedPosts = posts.map((post) => ({
      ...post,
      likes_count: post.likes?.[0]?.count || 0,
    }));

    return NextResponse.json({
      posts: formattedPosts,
    });

  } catch (err: any) {
    console.error("PROFILE POSTS ERROR:", err);

    return NextResponse.json(
      {
        error: err.message || "Failed to fetch profile posts",
      },
      { status: 500 }
    );
  }
}