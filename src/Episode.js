import React, {useEffect, useState} from "react";

import { usePlayerContext } from '@cassette/hooks';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import prettyTime from './prettyTime';

const Episode = ({user, episode, userEpisodes, setUserEpisodes, podcastId, setPlaylist, userEpId, setUserEpId, setMessage}) => {
    const {title, description, runtime, url, pubDate} = episode;
    const {currentTime, playlist, onTogglePause, onSeekComplete} = usePlayerContext(['currentTime', 'playlist', 'onTogglePause', 'onSeekComplete']);
    if(userEpId){console.log(userEpId);}

    const [showDesc, setShowDesc] = useState(false);
    const [userEpisode, setUserEpisode] = useState({
        listened: false, 
        current_time: 0
    });
    const [resumeTime, setResumeTime] = useState("");

    // Find any episodes a user has interacted with based on episodes titles from RSS listing
    useEffect(() => {
        const myEp = userEpisodes.find(userEpisode => userEpisode.title === title);

        if (myEp){
            console.log(myEp.id);
            setUserEpisode({current_time: myEp.current_time, listened: myEp.listened, id: myEp.id});
            const time = prettyTime(userEpisode.current_time);
            if(time !== 'Not provided' || time !== "00:00:00"){
                setResumeTime(`Resume from ${time}`);
            };
        }

    }, [ userEpisodes ])
    
    //Create new entry for episode in DB
    const createUserEpisode = () => {
        fetch('http://localhost:3000/user_episodes', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                Accept:'application/json'
            },
            body:JSON.stringify({
                user_id: user.id,
                podcast_id: podcastId,
                listened: userEpisode.listened,
                current_time: userEpisode.current_time,
                title: title
            })
        })
            .then(r => r.json())
            .then(savedEp => {
                setUserEpisode(savedEp);
                setUserEpId(savedEp.id);
                setUserEpisodes(...userEpisodes, savedEp);
                console.log("Created", savedEp, savedEp.id, userEpId);
            });
    }

    //userEpisode will only ever need to update time or listened status
    const updateUserEpisode = (id, time, listened) => {
        let body = {id: id};
        console.log(body);
        if(time){
            body = {...body, time: time };
        };

        if(listened){
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
                setUserEpisodes(...userEpisodes.filter(ep => ep.id !== updatedEpisode.id), updatedEpisode);
                console.log("updated", updatedEpisode);
            });
    } 

    const play = () =>{
        console.log('play');
        //Save episode to DB if no entry for episode is present
        if(userEpisode.id === undefined){
            createUserEpisode();
        } else {
            console.log(userEpisode.id)
            setUserEpId(userEpisode.id);
        }
    
        //If track is already playing, save current time to DB
        if (playlist[0]){
            console.log('playlist present');
            updateUserEpisode(userEpId, currentTime, null);
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

                    <span className="material-icons" onClick={() => play()}>
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
                        <span className="material-icons"onClick={()=>updateUserEpisode(userEpisode.id, null, true)}>
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
                
                <ListItemText secondary={`id: ${userEpisode.id} + ${resumeTime}`} />

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