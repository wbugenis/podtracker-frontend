import React from "react"
import { usePlayerContext } from "@cassette/hooks"

const PlayTrack = ({trackInfo, setPlaylist, updateUserEpisode}) => {
    const {currentTime, playlist, onTogglePause, onSeekComplete} = usePlayerContext(['currentTime', 'playlist', 'onTogglePause', 'onSeekComplete'])
    
    const play = () =>{
        console.log(trackInfo.current_time)
        if (currentTime !== 0){
            updateUserEpisode({current_time:currentTime})
        }
        setPlaylist([trackInfo].concat(playlist.slice(1)))
        setTimeout(()=> {
            onTogglePause(false)
            console.log(trackInfo.current_time)
            setTimeout(() => onSeekComplete(trackInfo.current_time), 100) 
        }, 500)  
    }

    return (
    <span className="material-icons" onClick={play}>
        play_arrow
    </span>
    )
}

export default PlayTrack;