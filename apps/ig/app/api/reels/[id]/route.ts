import supabase from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
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
    `)
    .eq("id", id)
    .single();

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}