
import supabase from "@/lib/supabase";

export async function POST(req:Request){
    const body = await req.formData();
    const file = body.get("file") as File;
    const caption = body.get("caption") as string;
    const musicTitle = body.get("musicTitle") as string;
    const musicArtist = body.get("musicArtist") as string;
    const musicAudioUrl = body.get("musicAudioUrl") as string;
    const musicCoverUrl = body.get("musicCoverUrl") as string;
    const musicExternalId = body.get("musicExternalId") as string;
    const musicSource = body.get("musicSource") as string;
    const userId = body.get("userId") as string;

    const fileType = file.type.split("/")[0];
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from("posts").upload(fileName, file);
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    const fileUrl = publicUrlData.publicUrl;

    const { data: insertData, error: insertError } = await supabase
      .from("posts")
      .insert({
        caption: caption,
        post_url: fileUrl,
        file_type: fileType,
        music_title: musicTitle,
        music_artist: musicArtist,
        music_audio_url: musicAudioUrl,
        music_cover_url: musicCoverUrl,
        music_external_id: musicExternalId,
        music_source: musicSource,
        user_id: userId,
      });

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
      }

    return new Response(JSON.stringify({ message: "Upload successful" }), { status: 200 });

}