import React from "react"
import { usePlayerContext } from "@cassette/hooks"

const QueueTrack = ({trackInfo, setPlaylist}) => {
    const { playlist } = usePlayerContext(['playlist'])
    
    return (
    <span className="material-icons" onClick={()=>setPlaylist(playlist.concat(trackInfo))}>
        playlist_add
    </span>
    )
}

export default QueueTrack;