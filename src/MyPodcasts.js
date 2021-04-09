import React, {useState, useEffect} from "react"
import Podcast from "./Podcast"

const MyPodcasts = () => {
    const [podcasts, setPodcasts] = useState([])
    console.log(podcasts)
    useEffect(()=> {
        fetch("http://localhost:3000/podcasts")
            .then(r => r.json())
            .then(podcasts => setPodcasts(podcasts))
    }, [])

    const podcastComps = podcasts.map(podcast => <Podcast podcast={podcast} key={podcast.id} />)
    
    return (
        <>
            {podcastComps}
        </>
    )
}

export default MyPodcasts;