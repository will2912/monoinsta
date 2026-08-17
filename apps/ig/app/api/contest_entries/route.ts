import supabase from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const contestId = searchParams.get("contestId");

  const { data, error } = await supabase
    .from("contest_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("contest_id", contestId)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(!!data);
}

export async function POST (request:Request){
  const body=await request.json();
  const { contestId, userId, postId } = body;
  if (!contestId || !userId || !postId) {
      return Response.json(
        {
          error: "contestId, userId and postId are required",
        },
        { status: 400 }
      );
    }

  const { data, error } = await supabase
      .from("contest_entries")
      .insert({
        contest_id: contestId,
        user_id: userId,
        post_id: postId,
        // nominated_at and status use database defaults
      })
      .select()
      .single();

      if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}