import React, {useState, useEffect} from "react"
import Parser from 'rss-parser'
//https://www.npmjs.com/package/rss-parser
import Episode from "./Episode"
import { Grid, List, ListSubheader, Typography, ButtonBase } from "@material-ui/core"

const Podcast = ({ user, unsubscribe, podcast, sub_id, setPlaylist, setMessage, setPodComponents }) => {
    const {id, title, description, podcast_img_url, podcast_home_url} = podcast
    const [episodes, setEpisodes] = useState([])
    const [userEpisodes, setUserEpisodes] = useState([])
    const [showEpisodes, setShowEpisodes] = useState(false)

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
                        url:(item.enclosure ? item.enclosure.url : "Not provided")
                    })
                })
                setEpisodes(episodes)
            })
    }, [])

    const episodeComps = episodes.map(episode => 
        <Episode 
            user={user} 
            episode={episode} 
            key={episode.title}
            setPlaylist={setPlaylist}
            podcastId={podcast.id} 
            setMessage={setMessage}
            userEpisodes={userEpisodes} 
            artwork={[{src:podcast_img_url, sizes:'196x196', type:'image/jpg'}]}
            artist={podcast.title} 
        />)
        
    const podComponents = (
        <>
            <h1>{title}</h1>
           <div id='description'>{description}></div>
                <List 
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Episodes
                    </ListSubheader>}
                >
                    {episodeComps}
                </List>
            </>
        )

    return (
        <Grid item xs zeroMinWidth className="episode-grid" onClick={()=>setPodComponents(podComponents)}>
            <h4>{title}</h4>
            <img src={podcast_img_url} alt={title}/>
            <br />
            <button onClick={()=>unsubscribe(title, sub_id)}>Unsubscribe</button>
            <a href={podcast_home_url} target="_blank" rel="noreferrer">Homepage</a>
            <br/>
        </Grid>
    )
}

export default Podcast;