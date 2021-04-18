import React from "react"
import { MediaPlayerControls } from '@cassette/player'
import { PlayerContextProvider } from '@cassette/core'
import '@cassette/player/dist/css/cassette-player.css'
//https://github.com/benwiley4000/cassette#readme

const BackSkip = ({onSeekComplete, currentTime }) => {
    return (
        <button
            style={{color:'white', display: 'flex', alignItems: 'center', fontSize: '36px'}}
            class="material-icons cassette__skip_button cassette__media_button"
            onClick={()=>onSeekComplete(currentTime-10)}>
                replay_10
        </button>
    );
  }

const FwdSkip = ({onSeekComplete, currentTime }) => {
    return (
        <div class="cassette__media_button_wrapper">
            
            <button type="button"
                style={{color:'white', display: 'flex', alignItems: 'center', fontSize: '36px'}}
                class="material-icons cassette__skip_button cassette__media_button" 
                onClick={()=>onSeekComplete(currentTime+30)}>
                    <div class="skip_button_inner foreground">
                    forward_30
                    </div>
            </button>
            
        </div>
    );
  }
  
const Player = ({currentTrack, setCurrentTrack}) => {
    const {title, src, type} = currentTrack

    console.log(src)
    const playlist = [{url:src, title:title}]
    return (
        <div id="player-div">
            <PlayerContextProvider playlist={playlist} > 
                <MediaPlayerControls
                    playlist={playlist}
                    autoplay
                    controls={[
                        'spacer',
                        'backskip',
                        'spacer',
                        playerContext => (
                            <BackSkip
                                onSeekComplete={playerContext.onSeekComplete}
                                currentTime={playerContext.currentTime}
                            />
                        ),
                        'spacer',
                        'playpause',
                        'spacer',
                        playerContext => (
                            <FwdSkip
                                onSeekComplete={playerContext.onSeekComplete}
                                currentTime={playerContext.currentTime}
                            />
                        ),
                        'spacer',
                        'forwardskip',
                        'volume',
                        'progress',
                    ]} />
            </PlayerContextProvider>
        </div>
    )
}

export default Player;