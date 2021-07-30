import React, {useEffect, useState} from "react"
import PlayTrack from './PlayTrack'
import QueueTrack from './QueueTrack'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const Episode = ({user, episode, userEpisodes, podcastId, setPlaylist, artwork, artist, setMessage}) => {
    const [showDesc, setShowDesc] = useState(false)
    const [userEpisode, setUserEpisode] = useState({listened: false, current_time:0, id:null})
    const {title, description, runtime, url, pubDate} = episode
    let trackInfo = {title, url, artwork, podcastId, user_id:user.id, current_time:userEpisode.current_time}

    // Find any episodes a user has interacted with based on episodes titles from RSS listing
    useEffect(() => {
        const myEp = userEpisodes.find(userEpisode => userEpisode.title === title)
        console.log(myEp)
        if (myEp){
            console.log("ep found!")
            setUserEpisode(myEp)
        }
        trackInfo = {...trackInfo, current_time:userEpisode.current_time}
    }, [userEpisodes])

    //Function to either post or update UserEpisodes, depending on if an entry already exists
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
            console.log(body)
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
        <>
        <ListItem >
            <ListItemIcon>
                <PlayTrack 
                    trackInfo={trackInfo} 
                    setPlaylist={setPlaylist} 
                    updateUserEpisode={updateUserEpisode} 
                    setMessage={setMessage} 
                    userEpisode={userEpisode} 
                />
                <QueueTrack 
                    trackInfo={trackInfo} 
                    setPlaylist={setPlaylist} 
                />
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
                style={userEpisode.listened ? {textDecorationColor: 'red', color:"white", textDecorationLine: 'line-through', textDecorationStyle: 'solid', alignItems:'flex-start'} : {alignItems:'flex-start'}}
                primary={title} 
                onClick={()=>setShowDesc(!showDesc)}
                secondary={`Runtime: ${runtime} | Published: ${pubDate}`}

            />
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