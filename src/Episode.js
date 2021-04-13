import React, {useEffect, useState} from "react"

const Episode = ({user, episode, setCurrentTrack}) => {
    const [showDesc, setShowDesc] = useState(false)
    const [userEpisode, setUserEpisode] = useState({listened: false, current_time:0})

    const {id, title, description, runtime, filepath, filetype, pubDate} = episode
    let myEp = episode.user_episodes.filter(episode => episode.user_id === user.id)[0]

    useEffect(() => { 
        if (myEp === undefined){
            myEp = {listened: false, current_time:0}
        }
        setUserEpisode(myEp)
    }, [])

    const updateListened = () => {
        if (myEp === undefined) {
            fetch('http://localhost:3000/user_episodes', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    Accept:'application/json'
                },
                body: JSON.stringify({user_id:user.id, episode_id:id, listened:!userEpisode.listened})
            })
                .then(r => r.json())
                .then(userEp => setUserEpisode(userEp))

        } else {

            fetch(`http://localhost:3000/user_episodes/${myEp.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type':'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({listened:!userEpisode.listened})
            })
                .then(r => r.json())
                .then(userEpisode => setUserEpisode(userEpisode)) 
        } 
                
    }

    

    return (
        <li style={userEpisode.listened ? {fontStyle:'italic'} : null}>
            <div>{title}</div>
            <div onClick={()=>setShowDesc(!showDesc)}>+ {showDesc ? <>{description}</> : null } </div>
            <div>{runtime} | {pubDate}</div>
            <button onClick={()=>setCurrentTrack({title:title, src:filepath, type:filetype})}>PLAY</button>
            <br/>
            <button onClick={updateListened}>Listened</button>
        </li>
    )
}

export default Episode;