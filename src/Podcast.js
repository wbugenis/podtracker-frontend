import React, {useState, useEffect} from "react";
import Parser from "rss-parser";
//https://www.npmjs.com/package/rss-parser
import Episode from "./Episode";
import { Grid, List, ListSubheader } from "@material-ui/core";

import prettyTime from './prettyTime';

const Podcast = ({ user, unsubscribe, podcast, sub_id, setPlaylist, setMessage, setPodComponents, setShowPodcasts, userEpId, setUserEpId}) => {
    const {id, title, description, podcast_img_url, podcast_home_url} = podcast;
    const [episodes, setEpisodes] = useState([]);
    const [userEpisodes, setUserEpisodes] = useState([]);

    console.log(userEpId);
    useEffect(() => {
        //Retrieve all entries of episodes the user has interacted with from backend
        fetch(`http://localhost:3000/userepisodes/${user.id}/${podcast.id}`)
            .then(r => r.json())
            .then(userEpisodes => setUserEpisodes(userEpisodes))

        //Get latest XML string of podcast's RSS feed to be parsed
        fetch(`http://localhost:3000/podcasts/${id}/feed`)
            .then(r => r.json())
            .then(xmlString => {
                const parser = new Parser();
                return parser.parseString(xmlString.body);
            })
            .then(dom => {
                const episodes = [];
                dom.items.forEach(item => {
                    episodes.push({
                        title: item.title||"Not provided",
                        description: item.content||"Not provided",
                        runtime: prettyTime(item.itunes.duration),
                        pubDate: item.pubDate.slice(0,16)||"Not provided",
                        url: (item.enclosure ? item.enclosure.url : "Not provided")
                    })
                })
                setEpisodes(episodes);
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
            userEpId={userEpId}
            setUserEpId={setUserEpId}
        />)
        
    const podComponents = (
        <>
            <div className='description'>
                <img src={podcast_img_url} alt={title}/>
                <div className='description-text'>
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
                        </ListSubheader>
                    }
                >
                    {episodeComps} 
                </List>
            </>
        )
    
    const showEpisodes = () => {
        setShowPodcasts(false)
        setPodComponents(podComponents)   
    }
  
    return (
        <Grid item className="podcast-div"  style={{margin:'1px 4px 1px 4px', padding: '2px 2px 2px 2px'}}>
            <h4>{title}</h4>
            <img src={podcast_img_url} alt={title} onClick={showEpisodes} />
            <br />
            <span className="material-icons" onClick={()=>unsubscribe(title, sub_id)}>
                delete_outline
            </span>
            <a href={podcast_home_url} target="_blank" rel="noreferrer" className="material-icons">home</a>
            <br/>
        </Grid>
    )
}

export default Podcast;