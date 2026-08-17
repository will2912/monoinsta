"use client";
import MusicPannel from "@/components/musicPannel";
import {Input} from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getUserId } from "@/service/user.service";
import { useRouter } from "next/navigation";


export default function UploadPage() {
    const router = useRouter();
    const {user} = useUser();

    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState<string>("");
    const [musicFile, setMusicFile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [musicValue, setMusicValue] = useState("search music");


    useEffect(() => {
        if (musicFile) {
            setMusicValue(`♪ ${musicFile.artist} - ${musicFile.title}`);
        }

    }, [musicFile]);

    const handleUpload=async ()=>{
        const user_id = await getUserId(user?.sub);
        const formdata = new FormData();
        formdata.append("userId", user_id);
        formdata.append("file", file);
        formdata.append("caption", caption);

        if(musicFile){
            formdata.append("musicTitle", musicFile.title);
            formdata.append("musicArtist", musicFile.artist);
            formdata.append("musicAudioUrl", musicFile.audioUrl);
            formdata.append("musicCoverUrl", musicFile.coverUrl);
            formdata.append("musicExternalId", musicFile.externalId);
            formdata.append("musicSource", musicFile.source);
        }
        const res= await fetch("/api/upload",{
            method:"POST",
            body:formdata
        })
        if(res.ok){
            router.push("/");
        }else {
        const data = await res.json();
        console.error(data.error);
        }
    }



    return(
        <div className="relative flex justify-center items-center h-full w-full ">
            <div className=" w-96 h-96 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center gap-4">
                <Input placeholder="Upload Image" type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null) } />
                <Input placeholder="Caption" type="text" value={caption} onChange={(e) => setCaption(e.target.value)} />
                <div className="w-full items-center p-2 border border-gray-300 rounded-lg"  onClick={() => setIsOpen(!isOpen)} >
                    <p> {musicValue}</p>
                </div>
                
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleUpload}>
                    Upload
                </button>

            </div>
            <div className="w-100px h-full  " >
                    <MusicPannel  setMusicFile={setMusicFile} isOpen={isOpen} setIsOpen={setIsOpen} setMusicValue={setMusicValue} />                   
            </div>
           
        </div>
    )
}
