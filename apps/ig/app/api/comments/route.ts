import supabase from "@/lib/supabase";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get("post_id");

  const { data, error } = await supabase
    .from("comments")
    .select(`
      id,
      content,
      created_at,
      users (
        username,
        avatar_url
      )
    `)
    .eq("post_id", post_id)
    .order("created_at", { ascending: true });

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json(data);
}





export async function POST(request: Request) {
  const body = await request.json();
  const { post_id, user_id, content } = body;

  // Insert comment
  const { error } = await supabase
    .from("comments")
    .insert({
      post_id,
      user_id,
      content,
    });

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // Get current comments_count
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("comments_count")
    .eq("id", post_id)
    .single();

  if (postError) {
    return Response.json(
      { error: postError.message },
      { status: 500 }
    );
  }

  // Increment comments_count
  const { error: updateError } = await supabase
    .from("posts")
    .update({
      comments_count: (post.comments_count ?? 0) + 1,
    })
    .eq("id", post_id);

  if (updateError) {
    return Response.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return Response.json({
    message: "Comment added successfully",
  });
}