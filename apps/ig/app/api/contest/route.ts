import supabase  from "@/lib/supabase";

export async function GET(req: Request) {
    const {data, error} = await supabase.from("contests").select("*").eq("status","open").maybeSingle();
    if(error){
        return Response.json({error:error.message},{status:500});
    }
    return Response.json({data});
}
