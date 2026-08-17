import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("search api called")
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ tracks: [] });
  }

  const clientId = process.env.JAMENDO_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Jamendo client id missing" },
      { status: 500 }
    );
  }

  const url = new URL("https://api.jamendo.com/v3.0/tracks/");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "10");
  url.searchParams.set("search", query);
  url.searchParams.set("include", "musicinfo");
  url.searchParams.set("audioformat", "mp32");
  url.searchParams.set("imagesize", "100");

  const res = await fetch(url.toString());

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to search music" },
      { status: 500 }
    );
  }

  const data = await res.json();

  const tracks =
    data.results?.map((track: any) => ({
      externalId: track.id,
      title: track.name,
      artist: track.artist_name,
      audioUrl: track.audio,
      coverUrl: track.album_image,
      source: "jamendo",
    })) || [];
    console.log("tracks", tracks)

  return NextResponse.json({ tracks });
}