import  supabase  from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { post_id, user_id, rating } = body;

    if (!post_id || !user_id || rating === undefined) {
      return Response.json(
        {
          error: "post_id, user_id and rating are required",
        },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 10
    ) {
      return Response.json(
        {
          error: "Rating must be an integer between 1 and 10",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        {
          post_id,
          user_id,
          rating: numericRating,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "post_id,user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Rating database error:", error);

      return Response.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        message: "Rating saved successfully",
        rating: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Rating API error:", error);

    return Response.json(
      {
        error: "Invalid request",
      },
      { status: 500 }
    );
  }
}