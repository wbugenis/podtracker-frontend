import React from "react";

import { MediaPlayerControls } from '@cassette/player';
import { usePlayerContext } from '@cassette/hooks';
import '@cassette/player/dist/css/cassette-player.css';
//https://github.com/benwiley4000/cassette#readme

//Custom Cassette button to allow skipping 10 seconds backward
const BackSkip = () => {
  const { playlist, currentTime, onSeekComplete } = usePlayerContext(['playlist', 'currentTime', 'onSeekComplete']);
  
  const handleClick = () => {
    if(playlist.length > 0){
      onSeekComplete(currentTime - 10);
    }
  }

  return (
    <span
      style={{color:'white', display: 'flex', alignItems: 'center', fontSize: '36px'}}
      className="material-icons cassette__skip_button cassette__media_button"
      onClick={handleClick}>
        <div className="skip_button_inner foreground">
        replay_10
        </div>
    </span>
  );
}

//Custom Cassette button to allow skipping 30 seconds forward
const FwdSkip = () => {
  const { playlist, currentTime, onSeekComplete } = usePlayerContext(['playlist', 'currentTime', 'onSeekComplete'])

  const handleClick = () => {
    if(playlist.length > 0){
      onSeekComplete(currentTime + 30);
    }
  }

  return (  
    <span
      style={{color:'white', display: 'flex', alignItems: 'center', fontSize: '36px'}}
      className="material-icons cassette__skip_button cassette__media_button" 
      onClick={handleClick}>
        <div className="skip_button_inner foreground">
            forward_30
            </div>
    </span>       
  );
}

const Player = () => {
    const { playlist } = usePlayerContext(['playlist', 'onStateSnapshot']);
    
    return (
      
      <div id="player-div">
        <MediaPlayerControls
          playlist={playlist}
          defaultVolume={0.2}
          defaultReplayStrategy={'none'}
          controls={[
            ()=> <BackSkip />,
            'playpause',
            () => <FwdSkip />,
            'volume',
            'progress',
          ]}
        />    
      </div>
    )
}

export default Player;