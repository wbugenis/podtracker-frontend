import React, { useState, useEffect } from "react";

import Episode from "./Episode";
import { List, ListSubheader } from "@material-ui/core";

import { useSelector } from "react-redux";

const PodcastInfo = ({user, setPlaylist, setMessage}) => {
    const [episodeComps, setEpisodeComps] = useState([]);

    const display = useSelector(state => state.podcast.display);
    const info = useSelector(state => state.podcast.info);
    const episodeList = useSelector(state => state.podcast.episodeList);

    useEffect(() => {
        setEpisodeComps(episodeList.map(episode => 
            <Episode
                user={user} 
                setPlaylist={setPlaylist}
                setMessage={setMessage}
                podcastId={info.id}
                episode={episode} 
                key={episode.title} 
                artwork={[{src:info.podcast_img_url, sizes:'196x196', type:'image/jpg'}]}
                artist={info.title}
            />)
        )
    }, [episodeList])

    return(
        <div id="podcast-detail" style={{display: display}}>
            <div className='description'>
                <img src={info.podcast_img_url} alt={info.title}/>
                <div className='description-text'>
                    <h2 style={{margin: '5px 0px 5px 0px'}}>{info.title}</h2>
                    <p style={{margin: '2px 2px 2px 2px'}}>{info.description.replace(/(<([^>]+)>)/gi, "")}</p>
                </div>
            </div>

            <List 
                component="nav"
                aria-labelledby="nested-list-subheader"
                style={{
                    display: display,
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
        </div>
    )
}

export default PodcastInfo;