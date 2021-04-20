import React, {useState, useEffect} from "react"
import Podcast from "./Podcast"

const MyPodcasts = ({user, setPlaylist, setMessage}) => {
    const [subscriptions, setSubscriptions] = useState([])
   
    useEffect(()=> {
        fetch(`http://localhost:3000/user/${user.id}/subscriptions`)
            .then(r => r.json())
            .then(subscriptions => {
                setSubscriptions(subscriptions)
            })
    }, [])

    const unsubscribe = (sub_id) => {
        fetch(`http://localhost:3000/subscriptions/${sub_id}`, {
            method:'DELETE'
        })
            .then(()=> setSubscriptions(subscriptions.filter(subscription => subscription.id !== sub_id)))
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
         />)
    
    return (
        <>
            {subscriptions.length > 0 ?
                <>
                    {podcastComps}
                </>
                :
                <h2>You haven't subscribed to any podcasts yet!</h2>
            }
        </>
    )
}

export default MyPodcasts;