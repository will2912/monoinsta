import supabase from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();
  const { post_id, user_id } = body;

  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("post_id", post_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    const { error } = await supabase
      .from("likes")
      .insert({
        post_id,
        user_id,
      });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ liked: true });
  }

  const { error: deleteError } = await supabase
    .from("likes")
    .delete()
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  if (deleteError) {
    return Response.json({ error: deleteError.message }, { status: 500 });
  }

  return Response.json({ liked: false });
}