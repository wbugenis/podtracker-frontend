import React, {useState, useEffect} from "react"
import Parser from 'rss-parser'
//https://www.npmjs.com/package/rss-parser
import Episode from "./Episode"

const Podcast = ({user, unsubscribe, podcast, sub_id, setCurrentTrack}) => {
    const {id, title, rss_feed, description, podcast_img_url, podcast_home_url} = podcast
    const [episodes, setEpisodes] = useState([])
    const [userEpisodes, setUserEpisodes] = useState([])
    const [showEpisodes, setShowEpisodes] = useState(false)
    console.log(userEpisodes)
    const prettyTime = (timeStr) => {
        if (timeStr){
            if (timeStr.includes(':')){
                return timeStr
            } else {
                let seconds = parseInt(timeStr)

                let hour = Math.floor(seconds/3600)+":"
                if (hour === 0) {
                    hour = ""
                }
                let minute = Math.floor(seconds%3600/60)
                if(minute < 10){
                    minute = "0" + minute
                }
                let second = Math.floor(seconds%60)
                if (second < 10){
                    second = "0" + second
                }
                return `${hour}${minute}:${second}`
            }
        } else return "Not provided"
    }

    useEffect(() => {
        fetch(`http://localhost:3000/userepisodes/${user.id}/${podcast.id}`)
            .then(r => r.json())
            .then(userEpisodes => setUserEpisodes(userEpisodes))

        fetch(`http://localhost:3000/podcasts/${id}/feed`)
            .then(r => r.json())
            .then(xmlString => {
                const parser = new Parser()
                return parser.parseString(xmlString.body)
            })
            .then(dom=> {
                const episodes = []
                dom.items.forEach(item => {
                    episodes.push({
                        title:item.title||"Not provided",
                        description:item.content||"Not provided",
                        runtime:prettyTime(item.itunes.duration),
                        pubDate:item.pubDate.slice(0,16)||"Not provided",
                        filepath:(item.enclosure ? item.enclosure.url : "Not provided")
                    })
                })
                setEpisodes(episodes)
            })
    }, [])

    const episodeComps = episodes.map(episode => <Episode user={user} episode={episode} key={episode.title} setCurrentTrack={setCurrentTrack} podcastId={podcast.id} userEpisodes={userEpisodes}/>)
    
    return (
        <div className="podcast-div">
            <img src={podcast_img_url} alt={title}/>
            <button onClick={()=>unsubscribe(sub_id)}>Unsubscribe</button>
            <h4>{title}</h4>
            <p>{description}</p>
            <a href={podcast_home_url} target="_blank" rel="noreferrer">Homepage</a>
            <button onClick={()=>setShowEpisodes(!showEpisodes)}>Show Episodes</button> 
            {showEpisodes ? 
                <ul className="episode-holder">
                    {episodeComps}
                </ul>
                :
                null
            }
        </div>
    )
}

export default Podcast;