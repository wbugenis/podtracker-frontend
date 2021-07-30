import React from "react"
import { usePlayerContext } from "@cassette/hooks"

//Component for play button on episode listings
const PlayTrack = ({trackInfo, setPlaylist, updateUserEpisode}) => {
    const {currentTime, playlist, onTogglePause, onSeekComplete} = usePlayerContext(['currentTime', 'playlist', 'onTogglePause', 'onSeekComplete'])
    
    const play = () =>{
        console.log(trackInfo.current_time)
        //If currently playing episode is already in progress, saves time to database for resuming in future
        if (currentTime !== 0){
            updateUserEpisode({current_time:currentTime})
        }
        //Puts podcast at front of playlist
        setPlaylist([trackInfo].concat(playlist.slice(1)))
        //Brief delay allows new episode time to load into player, skips to where previously left off if possible, then plays episode
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