import React, {useState} from "react"
import { MediaPlayer } from '@cassette/player'
import '@cassette/player/dist/css/cassette-player.css'
//https://github.com/benwiley4000/cassette#readme

const Player = ({currentTrack, setCurrentTrack}) => {
    const {title, src, type} = currentTrack
    console.log(src)
    const playlist = [ {url:src, title:title}]
    return (
        <div id="player-div">
            <MediaPlayer 
                playlist={playlist}
                autoplay
                controls={[
                    'spacer',
                    'playpause',
                    'seekforward',
                    'mute',
                    'spacer',
                    'progress'
                  ]} />
                  <br/>
        </div>
    )
}

export default Player;