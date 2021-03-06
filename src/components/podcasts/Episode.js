import React, { useEffect, useState } from "react";

import { usePlayerContext } from '@cassette/hooks';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import prettyTime from './prettyTime';

import { useSelector, useDispatch } from 'react-redux';
import { updateUserEpisodes } from '../../redux/epSlice';

const Episode = ({user, episode, podcastId, setPlaylist, setMessage}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    const {title, description, runtime, pubDate} = episode;
    const {currentTime, playlist, onTogglePause, onSeekComplete} = usePlayerContext(['currentTime', 'playlist', 'onTogglePause', 'onSeekComplete']);

    const [showDesc, setShowDesc] = useState(false);
    const [userEpisode, setUserEpisode] = useState({
        listened: false, 
        current_time: 0
    });
    const [resumeTime, setResumeTime] = useState("");

    const userEpisodes = useSelector(state => state.episodes.userEpisodes);
    const dispatch = useDispatch();

    // Find any episodes a user has interacted with based on episodes titles from RSS listing
    useEffect(() => {
        const myEp = userEpisodes.find(userEpisode => userEpisode.title === title);
        
        if (myEp){
            setUserEpisode(myEp);
            manageTime(myEp.current_time);
        }

    }, [])

    // Retrieves latest info after userEpisodes is edited
    useEffect(() => {
        const myEp = userEpisodes.find(userEpisode => userEpisode.title === title);
        
        if (myEp){
            setUserEpisode(myEp);
            manageTime(myEp.current_time);
        }

    }, [userEpisodes])

    //Creates a human-friendly timestamp readout
    const manageTime = (time) => {
        const niceTime = prettyTime(time);
        if(niceTime !== "Not provided" && niceTime !== "00:00:00"){
            setResumeTime(`Resume from ${niceTime}`);
        };
        if(time === 0){
            setResumeTime("");
        }
    }

    //Saves user episodes to the database - backend will determine if it is a create or update
    const dbUserEpisode = ( title, podId, time, listened ) => {
        let body = {
            user_id: user.id,
            podcast_id: podId,
            title: title
        }

        if(time || time === 0){
            body = {...body, current_time: time };
        };

        if(listened !== null){
            body = {...body, listened: listened };
        };

        // let fetchUrl = url + `/user_episodes/save`;
        fetch(`${url}/user_episodes/save`, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(r => r.json())
            .then(returnedEp => dispatch(updateUserEpisodes(returnedEp)))
    }

    //Handles click of play button on an episode
    const handlePlayClick = () => {
        setMessage({msg:`Playing ${title}`, severity: "info"});

        //If a track is playing, save to DB
        if (playlist[0]){
            dbUserEpisode(playlist[0].title, playlist[0].podcast_id, currentTime, null);
        };  

        //Replace first track of playlist with clicked episode
        setPlaylist([episode].concat(playlist.slice(1)));

        //Brief delay allows new episode time to load into player, skips to where previously left off if possible, then plays episode
        setTimeout(()=> {
            onTogglePause(false)
            setTimeout(() => onSeekComplete(userEpisode.current_time), 100) 
        }, 500)  
    }

    return (
        <>
            <ListItem >
                <ListItemIcon>

                    <span className="material-icons" onClick={handlePlayClick}>
                        play_arrow
                    </span>

                    {/* <span className="material-icons" onClick={ ()=>setPlaylist(playlist.concat(episode)) }>
                        playlist_add
                    </span> */}

                    {userEpisode.listened ?
                        <span className="material-icons" onClick={()=>dbUserEpisode(title, podcastId, null, false)}>
                            remove_done
                        </span>
                        :
                        <span className="material-icons" onClick={()=>dbUserEpisode(title, podcastId, null, true)}>
                            done
                        </span>
                    }

                </ListItemIcon>
                
                <ListItemText
                    style={userEpisode.listened ? 
                        {
                            textDecorationColor: 'red',
                            textDecorationLine: 'line-through', 
                            alignItems:'flex-start'
                        } 
                        : 
                        {alignItems:'flex-start'}
                    }
                    primary={title} 
                    onClick={()=>setShowDesc(!showDesc)}
                    secondary={`Runtime: ${runtime} | Published: ${pubDate}`}    
                />

                <ListItemIcon>
                    <ListItemText secondary={resumeTime} />
                    {userEpisode.current_time > 0 ? 
                        <span className="material-icons" onClick={()=>dbUserEpisode(title, podcastId, 0, null)}>
                        delete_outline
                        </span>
                    :
                        ""
                    }
                </ListItemIcon>

                <ListItemIcon onClick={()=>setShowDesc(!showDesc)} style={{color:'white'}}>
                    {showDesc ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
                
            </ListItem>
            
            <Collapse in={showDesc} timeout="auto" unmountOnExit onClick={()=>setShowDesc(!showDesc)}>
                <ListItemText inset="true" primary={description.replace(/(<([^>]+)>)/gi, "")} />
            </Collapse>
            <hr />
        </>
    )
}

export default Episode;