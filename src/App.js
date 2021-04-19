import React, { useState } from "react"
import { PlayerContextProvider } from '@cassette/core'

import Main from './Main'

function App() {
  const [playlist, setPlaylist] = useState([])
  
  return (
    <PlayerContextProvider playlist={playlist} >
      <Main setPlaylist={setPlaylist}/>
    </PlayerContextProvider>
  );
}

export default App;






