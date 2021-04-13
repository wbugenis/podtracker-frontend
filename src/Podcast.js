import React, {useState, useEffect} from "react"
import Episode from "./Episode"

const Podcast = ({user, unsubscribe, podcast, sub_id, setCurrentTrack}) => {
    const {id, title, rss_feed, description, podcast_img_url, podcast_home_url} = podcast
    const [episodes, setEpisodes] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3000/podcasts/${id}/episodes`)
            .then(r => r.json())
            .then(episodes => setEpisodes(episodes))
    }, [])

    const episodeComps = episodes.map(episode => <Episode user={user} episode={episode} key={episode.title} setCurrentTrack={setCurrentTrack}/>)

    return <div className="podcast-div">
        <img src={podcast_img_url} alt={title}/>
        <button onClick={()=>unsubscribe(sub_id)}>Unsubscribe</button>
        <h4>{title}</h4>
        <p>{description}</p>
        <a href={podcast_home_url} target="_blank" rel="noreferrer">Homepage</a> 
        <ul className="episode-holder">
            {episodeComps}
        </ul>       
    </div>
}

export default Podcast;