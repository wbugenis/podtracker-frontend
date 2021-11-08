import React, {useState, useEffect} from "react";

import Episode from "./Episode";
import { Grid, List, ListSubheader } from "@material-ui/core";

import prettyTime from './prettyTime';

import { useSelector, useDispatch} from 'react-redux';
import { setUserEpisodes } from './redux/epSlice';

const Podcast = ({ user, unsubscribe, podcast, sub_id, setPlaylist, setMessage, setPodInfo, setPodEpisodes, togglePodcastDisplay}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    
    const {id, description, podcast_img_url, podcast_home_url} = podcast;
    let {title} = podcast;
    const [showing, setShowing] = useState(false);
    const [episodeComps, setEpisodeComps] = useState([]);
    const [episodeList, setEpisodeList] = useState(null);
    const dispatch = useDispatch();
    const userEpisodes = useSelector(state => state.episodes.userEpisodes);

    //Trim podcast title so it fits in display
    if(title.length > 70){
        title = podcast.title.slice(0, 70) + '...';
    }

    useEffect(() => {
        //Retrieve all entries of episodes the user has interacted with from backend
        if(userEpisodes.length < 1){
            let fetchUrl = url + 'userepisodes/' + user.id + '/' + podcast.id;
            fetch(fetchUrl)
                .then(r => r.json())
                .then(userEps => dispatch(setUserEpisodes(userEps)))
        }

        //Get object of parsed XML feed
        let fetchUrl = url + 'podcasts/' + id + '/feed';
        fetch(fetchUrl)
            .then(r => r.json())
            .then(feed => {
                const episodes = [];

                feed.channel.item.forEach(item => {
                    //Ternary statements prevent app from breaking if RSS feed fields aren't properly filled
                    episodes.push({
                        title: item.title||"Not provided",
                        description: item.description||"Not provided",
                        runtime: (item.itunes_duration ? prettyTime(item.itunes_duration.content) : "Not provided"),
                        pubDate: item.pubDate.slice(0,10)||"Not provided",
                        url: (item.enclosure ? item.enclosure.url : "Not provided")
                    })
                })

                setEpisodeComps(episodes.map(episode => 
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
                )

            })
    }, [])
    
    useEffect(() => {
        if(showing === true){
            setPodEpisodes(<List 
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
            </List>)
        }
    }, [episodeComps, showing])

    const handleUnsubscribe = () => {
        unsubscribe(title, sub_id)
        setEpisodeComps(null);
        setPodInfo(null);
        setPodEpisodes(null)
        setShowing(false);
    }

    const podInfo = (
            <div className='description'>
                <img src={podcast_img_url} alt={podcast.title}/>
                <div className='description-text'>
                    <h2 style={{margin: '5px 0px 5px 0px'}}>{podcast.title}</h2>
                    <p style={{margin: '2px 2px 2px 2px'}}>{description.replace(/(<([^>]+)>)/gi, "")}</p>
                </div>
            </div>
    )
    
    const showEpisodes = () => {
        setShowing(true);
        togglePodcastDisplay();
        setPodInfo(podInfo);   
    }

    return (
        <Grid item xs={1} className="podcast-div" style={{padding:'5px', margin:'0px 5px 5px 0px' }} >
            <h4 style={{height:'60px'}}>{title}</h4>
            <img src={podcast_img_url} alt={title} onClick={showEpisodes} />
            <br />
            <span className="material-icons" onClick={handleUnsubscribe}>
                delete_outline
            </span>
            <a href={podcast_home_url} target="_blank" rel="noreferrer" className="material-icons" style ={{textDecoration:"none"}}>home</a>
            <br />
        </Grid>
    )
}

export default Podcast;