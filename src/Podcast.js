import React, {useState, useEffect} from "react"
import Parser from 'rss-parser'
//https://www.npmjs.com/package/rss-parser
import Episode from "./Episode"
import { Grid, List, ListSubheader } from "@material-ui/core"

const Podcast = ({ user, unsubscribe, podcast, sub_id, setPlaylist, setMessage, setPodComponents, setShowPodcasts}) => {
    const {id, title, description, podcast_img_url, podcast_home_url} = podcast
    const [episodes, setEpisodes] = useState([])
    const [userEpisodes, setUserEpisodes] = useState([])

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
            setUserEpisodes={setUserEpisodes}
            artwork={[{src:podcast_img_url, sizes:'196x196', type:'image/jpg'}]}
            artist={podcast.title} 
        />)
        
    const podComponents = (
        <>
            <div className='description'>
                <img src={podcast_img_url} alt={title}/>
                <div class='description-text'>
                    <h2 style={{margin: '5px 0px 5px 0px'}}>{title}</h2>
                    <p style={{margin: '2px 2px 2px 2px'}}>{description.replace(/(<([^>]+)>)/gi, "")}</p>
                </div>
            </div>
                <List 
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    style={{
                        overflowY:'scroll',
                        backgroundColor: 'rgba(144,144,144,0.5)',
                        borderRadius:'15px',
                        height:'600px',
                        width:'800px'
                    }}
                    subheader={
                    <ListSubheader 
                        component="div" 
                        id="nested-list-subheader" 
                        className="episode-container"
                        style={{backgroundColor: 'rgba(144,144,144,1)'}}
                    >
                        Episodes
                    </ListSubheader>}
                >
                    {episodeComps} 
                </List>
            </>
        )
    
    const showEpisodes = () => {
        console.log(episodeComps)
        console.log("showing", podComponents)
        setShowPodcasts(false)
        setPodComponents(podComponents)   
    }

    console.log(title, podcast_home_url)   
    return (
        <Grid item className="podcast-div"  style={{margin:'1px 4px 1px 4px', padding: '2px 2px 2px 2px'}}>
            <h4>{title}</h4>
            <img src={podcast_img_url} alt={title} onClick={showEpisodes} />
            <br />
            <span class="material-icons" onClick={()=>unsubscribe(title, sub_id)}>
                delete_outline
            </span>
            {/* <span class="material-icons-outlined">
                home
            </span> */}
            <a href={podcast_home_url} target="_blank" rel="noreferrer" className="material-icons">home</a>
            <br/>
        </Grid>
    )
}

export default Podcast;