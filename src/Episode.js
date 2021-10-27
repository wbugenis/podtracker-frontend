import React, { useEffect, useState } from "react";

import { usePlayerContext } from '@cassette/hooks';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import prettyTime from './prettyTime';

import {useSelector, useDispatch} from 'react-redux';
import { changeId, addUserEpisodes, updateUserEpisodes } from './redux/epSlice';

const Episode = ({user, episode, podcastId, setPlaylist, setMessage}) => {
    const {title, description, runtime, pubDate} = episode;
    const {currentTime, playlist, onTogglePause, onSeekComplete} = usePlayerContext(['currentTime', 'playlist', 'onTogglePause', 'onSeekComplete']);

    const [showDesc, setShowDesc] = useState(false);
    const [userEpisode, setUserEpisode] = useState({
        listened: false, 
        current_time: 0
    });
    const [resumeTime, setResumeTime] = useState("");

    const userEpId = useSelector(state => state.episodes.epId); 
    const userEpisodes = useSelector(state => state.episodes.userEpisodes);
    const dispatch = useDispatch();

    useEffect(() => {
        findUserEpisode();
    }, [userEpisodes])

    // Find any episodes a user has interacted with based on episodes titles from RSS listing
    const findUserEpisode = () => {
        const myEp = userEpisodes.find(userEpisode => userEpisode.title === title);

        if (myEp){
            setUserEpisode(userEpisode => userEpisode = myEp);
            manageTime(myEp.current_time);
        }
    }

    //Creates a human-friendly timestamp readout
    const manageTime = (time) => {
        const niceTime = prettyTime(time);
        if(niceTime !== "Not provided" && niceTime !== "00:00:00"){
            setResumeTime(`Resume from ${niceTime}`);
        };
    }

    //Create new entry for episode in DB
    const createUserEpisode = (listened) => {
        fetch('http://localhost:3000/user_episodes', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Accept:'application/json'
            },
            body:JSON.stringify({
                user_id: user.id,
                podcast_id: podcastId,
                listened: listened,
                current_time: userEpisode.current_time,
                title: title
            })
        })
            .then(r => r.json())
            .then(savedEp => {
                dispatch(changeId({id: savedEp.id}));
                dispatch(addUserEpisodes(savedEp));
                play();
            })                
    }

    //userEpisode will only ever need to update time or listened status
    const updateUserEpisode = (id, time, listened) => {
        console.log(id, time, listened);
        let body = {id: id};

        if(time || time === 0){
            body = {...body, current_time: time };
        };

        if(listened !== null){
            body = {...body, listened: listened };
        };

        console.log("body", body);

        fetch(`http://localhost:3000/user_episodes/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(r => r.json())
            .then(updatedEpisode => {
                dispatch(updateUserEpisodes(updatedEpisode));
                console.log("updated", updatedEpisode);
            });
    } 

    //Checks if userEpisode is present for this episode, creates one if not 
    //Runs when play button or "listened" buttons are clicked
    const saveUserEpisode = () =>{
        //Save episode to DB if no entry for episode is present
        console.log("ep found", userEpisode);
        if(userEpisode.id === undefined){
            createUserEpisode(false);
        } else {
            play();
            dispatch(changeId({id: userEpisode.id}));
        }

        console.log(userEpisode, userEpisode.id);
    
        //If track is already playing, save current time to DB
        if (playlist[0]){
            console.log('playlist present');
            updateUserEpisode(userEpId, currentTime, null);
        };  
    }

    //Starts episode playback in Casettte player
    const play = () => {
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
        <div onClick={()=> console.log(userEpisode)}>click me</div>
            <ListItem >
                <ListItemIcon>

                    <span className="material-icons" onClick={() => saveUserEpisode()}>
                        play_arrow
                    </span>

                    <span className="material-icons" onClick={()=>setPlaylist(playlist.concat(userEpisode))}>
                        playlist_add
                    </span>

                    {userEpisode.listened ?
                        <span className="material-icons" onClick={()=>updateUserEpisode(userEpisode.id, null, false)}>
                            remove_done
                        </span>
                        :
                        userEpisode.id ? 
                            <span className="material-icons" onClick={()=>updateUserEpisode(userEpisode.id, null, true)}>
                                done
                            </span>
                            :
                            <span className="material-icons" onClick={()=>createUserEpisode(true)}>
                                done
                            </span>   
                    }
                </ListItemIcon>
                
                <ListItemText
                    style={userEpisode.listened ? {textDecorationColor: 'red', color:"white", textDecorationLine: 'line-through', textDecorationStyle: 'solid', alignItems:'flex-start'} : {alignItems:'flex-start'}}
                    primary={title} 
                    onClick={()=>setShowDesc(!showDesc)}
                    secondary={`Runtime: ${runtime} | Published: ${pubDate}`}    
                />

                <ListItemIcon>
                    <ListItemText secondary={`ID: ${userEpisode.id} / ${resumeTime}`} />
                
                    <span className="material-icons" onClick={()=>updateUserEpisode(userEpisode.id, 0, null)}>
                    delete_outline
                </span>
                </ListItemIcon>

                <ListItemIcon onClick={()=>setShowDesc(!showDesc)} style={{color:'white'}}>
                    {showDesc ? <ExpandLess /> : <ExpandMore />}
                </ListItemIcon>
                
            </ListItem>
            
            <Collapse in={showDesc} timeout="auto" unmountOnExit onClick={()=>setShowDesc(!showDesc)}>
                <ListItemText primary={description.replace(/(<([^>]+)>)/gi, "")} styles={{margin:'10px', textSize:'8px'}}/>
            </Collapse>
            <hr />
        </>
    )
}

export default Episode;