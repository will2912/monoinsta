import {Input} from "./ui/input"
import { Button } from "./ui/button"
import { useState } from "react";
import {X } from "lucide-react"



export default function MusicPannel ({setMusicFile,isOpen,setIsOpen , setMusicValue}:any) {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMusic, setSelectedMusic] = useState(null);

    const handleSearch =async ()=>{
        const result = await fetch(`/api/music/search?q=${searchQuery}`);
        const data = await result.json();
        setSearchResults(data.tracks);
    }


    
    

    return(
        <div className={`fixed w-[300px] h-screen  absolute top-0 right-0 p-4 flex flex-col border-l border-gray-300 ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
            <div className="h-10 border-b border-gray-300 mb-4">
                <div className="flex items-center justify-between">
                    <h2>Add Music</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </Button>
                </div>
            </div>
            <div className="h-10   flex items-center justify-between">
                <Input placeholder="Search Music" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <Button variant="ghost" className="ml-2" onClick={handleSearch}>
                   Search
                </Button>
            </div>
            <div className="flex-1  overflow-y-scroll  no-scrollbar">
                {searchResults.length > 0 ? (
                    searchResults.map((track:any)=>(
                        <Button key={track.externalId} className={`h-auto w-full flex justify-start items-center p-2 border-b border-gray-300 hover:bg-zinc-800 ${selectedMusic?"bg-blue-600/30 ring-1 ring-blue-500":"bg-zinc-900 hover:bg-zinc-800"}`} onClick={() => setSelectedMusic(track)}>
                            <img src={track.coverUrl} alt={track.title} className="h-12 w-12 rounded object-cover" />
                            <div className="  min-w-0 flex flex-col flex-1 text-left">
                               <p className="truncate font-medium">{track.title}</p>
                                <p className="truncate text-sm text-white/60">
                                    {track.artist}
                                </p>
                            </div>
                        </Button>
                    ))
                ) : (
                    null
                )}
            </div>
            <div className="h-10 border-t border-gray-300 mt-4 flex items-center justify-center">
                <Button variant="ghost" className="ml-2 w-full " onClick={()=>{setMusicFile(selectedMusic); setIsOpen(false);}}  >
                   Add Music
                </Button>
            </div>
            

        </div>
    )
}
