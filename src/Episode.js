import React, {useEffect, useState} from "react"

const Episode = ({user, episode, userEpisodes, podcastId, playTrack, artwork, artist, queueTrack}) => {
    const [showDesc, setShowDesc] = useState(false)
    const [userEpisode, setUserEpisode] = useState({listened: false, current_time:0, id:null})
    const {title, description, runtime, url, pubDate} = episode
    
    useEffect(() => {
        const myEp = userEpisodes.find(userEpisode => userEpisode.title === title)
        console.log(myEp)
        if (myEp){
            console.log("ep found!")
            setUserEpisode(myEp)
        }
    }, [userEpisodes])

    const updateListened = () => {
        if (userEpisode.id === null) {
            fetch('http://localhost:3000/user_episodes', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    Accept:'application/json'
                },
                body: JSON.stringify({user_id:user.id, podcast_id:podcastId, listened:true, title:title})
            })
                .then(r => r.json())
                .then(userEp => setUserEpisode(userEp))

        } else {

            fetch(`http://localhost:3000/user_episodes/${userEpisode.id}`, {
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
            <button onClick={()=>playTrack({title, url, artwork, artist})}>PLAY</button>
            <br/>
            <button onClick={()=>queueTrack({title, url, artwork, artist})}>QUEUE</button>
            <button onClick={updateListened}>Listened</button>
        </li>
    )
}

export default Episode;