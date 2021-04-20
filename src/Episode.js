import React, {useEffect, useState} from "react"
import PlayTrack from './PlayTrack'
import QueueTrack from './QueueTrack'
import { ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
 
const Episode = ({user, episode, userEpisodes, podcastId, setPlaylist, artwork, artist, setMessage}) => {
    const [showDesc, setShowDesc] = useState(false)
    const [userEpisode, setUserEpisode] = useState({listened: false, current_time:0, id:null})
    const {title, description, runtime, url, pubDate} = episode
    let trackInfo = {title, url, artwork, artist, podcastId, user_id:user.id, current_time:userEpisode.current_time}

    useEffect(() => {
        const myEp = userEpisodes.find(userEpisode => userEpisode.title === title)
        console.log(myEp)
        if (myEp){
            console.log("ep found!")
            setUserEpisode(myEp)
        }
        trackInfo = {...trackInfo, current_time:userEpisode.current_time}
    }, [userEpisodes])

    const updateUserEpisode = (body) => {
        console.log(body)
        if (userEpisode.id === null) {
            console.log("no UserEp")
            body = {user_id:user.id, podcast_id:podcastId, title:title, listened:body.listened, current_time:body.current_time}
            fetch('http://localhost:3000/user_episodes', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    Accept:'application/json'
                },
                body: JSON.stringify(body)
            })
                .then(r => r.json())
                .then(userEp => setUserEpisode(userEp))
        } else {
            console.log("userep", body)
            fetch(`http://localhost:3000/user_episodes/${userEpisode.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type':'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(body)
            })
                .then(r => r.json())
                .then(userEpisode => setUserEpisode(userEpisode)) 
        }
    } 
  
    return (
        <ListItem >
            <ListItemIcon>
                <PlayTrack trackInfo={trackInfo} setPlaylist={setPlaylist} updateUserEpisode={updateUserEpisode} setMessage={setMessage} />
                <QueueTrack trackInfo={trackInfo} setPlaylist={setPlaylist} />
                {userEpisode.listened ?
                    <span className="material-icons" onClick={()=>updateUserEpisode({listened:false})}>
                        remove_done
                    </span>
                    :
                    <span className="material-icons"onClick={()=>updateUserEpisode({listened:true})}>
                        done
                    </span>
                }
            </ListItemIcon>
            <ListItemText
                style={userEpisode.listened ? {textDecorationLine: 'line-through', textDecorationStyle: 'solid', } : null}
                primary={title} 
                secondary={`Runtime: ${runtime} | Published: ${pubDate}`}
            />
            <ListItemIcon onClick={()=>setShowDesc(!showDesc)}>
                {showDesc ? <ExpandLess /> : <ExpandMore />}
            </ListItemIcon>
            <Collapse in={showDesc} timeout="auto" unmountOnExit>
                <ListItemText primary={description} />
            </Collapse>
        </ListItem>
        /* <li style={userEpisode.listened ? {fontStyle:'italic'} : null}>
            <div>{title}</div>
            <div onClick={()=>setShowDesc(!showDesc)}>+ {showDesc ? <>{description}</> : null } </div>
            <div>{runtime} | {pubDate}</div>
            
            <button onClick={updateUserEpisode}>Listened</button>
        </li> */
    )
}

export default Episode;