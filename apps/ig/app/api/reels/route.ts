import supabase from "@/lib/supabase"
export async function GET() {
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
  `);

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return Response.json(data)
}

