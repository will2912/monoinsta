import supabase from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const contestId = searchParams.get("contestId");

  if (!contestId) {
    return Response.json(
      { error: "contestId is required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.rpc(
    "get_contest_leaderboard",
    {
      p_contest_id: contestId,
    }
  );

  if (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return Response.json({
    entries: data ?? [],
  });
}