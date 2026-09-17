// app/reels/page.tsx
import Reel from "@/components/reel";
export default async function Page({ searchParams }:any) {
    const { post } = await searchParams;

    return <Reel postId={post} />;
}