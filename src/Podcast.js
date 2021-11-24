import React, {useState, useEffect} from "react";

import { Grid } from "@material-ui/core";

import prettyTime from './prettyTime';

import { useSelector, useDispatch} from 'react-redux';
import { setDisplay, setInfo, setEpisodeList } from "./redux/podSlice";

const Podcast = ({ user, unsubscribe, podcast, sub_id, togglePodcastDisplay}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    
    const [episodes, setEpisodes] = useState([]);

    const dispatch = useDispatch();
    const userEpisodes = useSelector(state => state.episodes.userEpisodes);

    const { id, title, description, podcast_img_url, podcast_home_url } = podcast;
    //Trim podcast title so it displays nicely in element, add ellipses if cut
    let shortTitle = title.slice(0, 51);
    if(title.length >= 51){
        shortTitle += "...";
    }
    
    useEffect(() => {
        
        //Get object of parsed XML feed
        let fetchFeed = url + 'podcasts/' + id + '/feed';
        fetch(fetchFeed)
            .then(r => r.json())
            .then(feed => {
                const eps = [];

                feed.channel.item.forEach(item => {
                    //Ternary statements prevent app from breaking if RSS feed fields aren't properly filled
                    eps.push({
                        title: item.title||"Not provided",
                        description: item.description||"Not provided",
                        runtime: (item.itunes_duration ? prettyTime(item.itunes_duration.content) : "Not provided"),
                        pubDate: item.pubDate.slice(0,10)||"Not provided",
                        url: (item.enclosure ? item.enclosure.url : "Not provided"),
                        podcastId: id
                    })
                })
                
                setEpisodes(eps);
            })

    }, [])

    const handleUnsubscribe = () => {
        dispatch(setDisplay("none"));
        dispatch(setInfo({
                id: null,
                podcast_img_url: "",
                title: "",
                description: ""
            })
        );
        dispatch(setEpisodeList([]));
        unsubscribe(title, sub_id);
    }
    
    const showEpisodes = () => {
        dispatch(setDisplay("block"));
        dispatch(setInfo({
                id: id,
                podcast_img_url: podcast_img_url,
                title: podcast.title,
                description: description
            })
        )

        dispatch(setEpisodeList(episodes));
        togglePodcastDisplay();
    }

    return (
        <Grid item xs={1} className="podcast-div" style={{padding:'5px', margin:'0px 5px 5px 0px' }} >
            <h4 style={{height:'60px'}}>{shortTitle}</h4>
            {episodes.length === 0 ? <div className="podcast-loader"></div> : "" }
            <img src={podcast_img_url} alt={shortTitle} onClick={showEpisodes} />
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