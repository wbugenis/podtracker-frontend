import React from "react"
import { MediaPlayerControls } from '@cassette/player'
import {usePlayerContext} from '@cassette/hooks'
import '@cassette/player/dist/css/cassette-player.css'
//https://github.com/benwiley4000/cassette#readme

const BackSkip = ({onSeekComplete, currentTime }) => {
  return (
    <span
      style={{color:'white', display: 'flex', alignItems: 'center', fontSize: '36px'}}
      class="material-icons cassette__skip_button cassette__media_button"
      onClick={()=>onSeekComplete(currentTime-10)}>
        <div class="skip_button_inner foreground">
        replay_10
        </div>
    </span>
  );
}

const FwdSkip = () => {
  const {currentTime, onSeekComplete} = usePlayerContext(['currentTime', 'onSeekComplete'])
    return (  
      <span
        style={{color:'white', display: 'flex', alignItems: 'center', fontSize: '36px'}}
        class="material-icons cassette__skip_button cassette__media_button" 
        onClick={()=>onSeekComplete(currentTime+30)}>
          <div class="skip_button_inner foreground">
              forward_30
              </div>
      </span>       
    );
  }

const Player = () => {
    const {playlist} = usePlayerContext(['playlist'])
    console.log(playlist)
    return (
        <div id="player-div">
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
                    () => <FwdSkip />,
                    'spacer',
                    'forwardskip',
                    'volume',
                    'progress',
                ]} /> 
        </div>
    )
}

export default Player;