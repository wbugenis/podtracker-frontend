import React from 'react'
import { usePlayerContext} from '@cassette/hooks'

const PlayerContextUser = () => {
    const {onTogglePause} = usePlayerContext(['onTogglePause'])

    return (
        <button onClick={onTogglePause}>Pause</button>
    )
}

export default PlayerContextUser;