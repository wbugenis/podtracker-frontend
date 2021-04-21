import React, {useState, useEffect} from "react"
import Podcast from "./Podcast"
import { Grid } from '@material-ui/core'

const MyPodcasts = ({user, setPlaylist, setMessage, subscriptions, setSubscriptions}) => {
    const [podComponents, setPodComponents] = useState(null)

    useEffect(()=> {
        fetch(`http://localhost:3000/user/${user.id}/subscriptions`)
            .then(r => r.json())
            .then(subscriptions => {
                setSubscriptions(subscriptions)
            })
    }, [])

    const unsubscribe = (title, sub_id) => {
        fetch(`http://localhost:3000/subscriptions/${sub_id}`, {
            method:'DELETE'
        })
            .then(()=> {
                setSubscriptions(subscriptions.filter(subscription => subscription.id !== sub_id))
                setMessage({msg:`Unsubscribed from - ${title}`, severity:"error"})
            })
    }

    const podcastComps = subscriptions.map(subscription => 
        <Podcast 
            user={user} 
            unsubscribe={unsubscribe} 
            sub_id={subscription.id} 
            podcast={subscription.podcast} 
            key={subscription.podcast.title} 
            setPlaylist={setPlaylist}
            setMessage={setMessage}
            setPodComponents={setPodComponents}
         />)
    
    return (
        <>
            {subscriptions.length > 0 ?
                <Grid container spacing={4} className='podcast-div' >
                    {podcastComps}
                </Grid>
                :
                <h2>You haven't subscribed to any podcasts yet!</h2>
            }
            <div id="podcast-detail">
                {podComponents}
            </div>
        </>
    )
}

export default MyPodcasts;