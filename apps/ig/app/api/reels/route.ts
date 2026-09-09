import supabase from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

  let query = supabase
    .from("posts")
    .select(`
      *,
      users (
        username,
        avatar_url,
        id
      ),
      likes (
        id,
        user_id
      ),
      ratings (
        user_id,
        rating
      ),
      comments (
        id
      )
    `);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  query = query
    .order("created_at", { ascending: false })
    .limit(10);

  const { data, error } = await query;

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}