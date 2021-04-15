import React, {useState} from "react"
import { MediaPlayerControls } from '@cassette/player'
import { PlayerContextProvider } from '@cassette/core'
import { usePlayerContext } from '@cassette/hooks'
import '@cassette/player/dist/css/cassette-player.css'
//https://github.com/benwiley4000/cassette#readme


const PlayerContextUser = () => {
    let { currentTime, onSeekComplete} = usePlayerContext(['currentTime', 'onSeekComplete'])
    console.log(currentTime)
    return (
    <p>
        {currentTime}
        <button onClick={()=>onSeekComplete(currentTime-30)}>Back 30</button>
        <button onClick={()=>onSeekComplete(currentTime+30)}>Add 30</button>
    </p>)
}

const Player = ({currentTrack, setCurrentTrack}) => {
    const {title, src, type} = currentTrack

    console.log(src)
    const playlist = [{url:src, title:title}]
    return (
        <div id="player-div">
            <PlayerContextProvider playlist={playlist} playerContext={['currentTime', 'onSeekComplete']} > 
                <MediaPlayerControls
                    playlist={playlist}
                    autoplay
                    controls={[
                        'spacer',
                        'playpause',
                        'mute',
                        'spacer',
                        'progress',
                    ]} />
                    <PlayerContextUser />
            </PlayerContextProvider>
            <br/>
        </div>
    )
}

export default Player;