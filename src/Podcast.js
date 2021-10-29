import React, {useState, useEffect} from "react";

import Episode from "./Episode";
import { Grid, List, ListSubheader } from "@material-ui/core";

import prettyTime from './prettyTime';

import { useSelector, useDispatch} from 'react-redux';
import { setUserEpisodes } from './redux/epSlice';

const Podcast = ({ user, unsubscribe, podcast, sub_id, setPlaylist, setMessage, setPodComponents, togglePodcastDisplay}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    
    const {id, title, description, podcast_img_url, podcast_home_url} = podcast;
    const [episodes, setEpisodes] = useState([]);

    const dispatch = useDispatch();
    const userEpisodes = useSelector(state => state.episodes.userEpisodes);


    useEffect(() => {
        //Retrieve all entries of episodes the user has interacted with from backend
        if(userEpisodes.length < 1){
            fetch(`${url}userepisodes/${user.id}/${podcast.id}`)
                .then(r => r.json())
                .then(userEps => dispatch(setUserEpisodes(userEps)))
        }

        //Get object of parsed XML feed
        fetch(`${url}podcasts/${id}/feed`)
            .then(r => r.json())
            .then(feed => {
                const episodes = [];

                feed.channel.item.forEach(item => {
                    //Ternary statements prevent app from breaking if RSS feed fields aren't properly filled
                    episodes.push({
                        title: item.title||"Not provided",
                        description: item.content||"Not provided",
                        runtime: (item.itunes_duration ? prettyTime(item.itunes_duration.content) : "Not provided"),
                        pubDate: item.pubDate.slice(0,16)||"Not provided",
                        url: (item.enclosure ? item.enclosure.url : "Not provided")
                    })
                })

                setEpisodes(episodes);
            })
    }, [])
    
    const handleUnsubscribe = () => {
        unsubscribe(title, sub_id)
        setEpisodes([]);
        setPodComponents(null);
    }

    const episodeComps = episodes.map(episode => 
        <Episode 
            user={user} 
            episode={episode} 
            key={episode.title}
            setPlaylist={setPlaylist}
            podcastId={podcast.id} 
            setMessage={setMessage}
            artwork={[{src:podcast_img_url, sizes:'196x196', type:'image/jpg'}]}
            artist={podcast.title}
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
        togglePodcastDisplay();
        setPodComponents(podComponents);   
    }

    return (
        <Grid item className="podcast-div"  style={{margin:'1px 4px 1px 4px', padding: '2px 2px 2px 2px'}}>
            <h4>{title}</h4>
            <img src={podcast_img_url} alt={title} onClick={showEpisodes} />
            <br />
            <span className="material-icons" onClick={handleUnsubscribe}>
                delete_outline
            </span>
            <a href={podcast_home_url} target="_blank" rel="noreferrer" className="material-icons">home</a>
            <br />
        </Grid>
    )
}

export default Podcast;