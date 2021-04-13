import React, {useState, useEffect} from "react"
import Podcast from "./Podcast"

const MyPodcasts = ({user, setCurrentTrack}) => {
    const [subscriptions, setSubscriptions] = useState([])
    console.log(subscriptions)

    useEffect(()=> {
        fetch(`http://localhost:3000/user/${user.id}/subscriptions`)
            .then(r => r.json())
            .then(subscriptions => setSubscriptions(subscriptions))
    }, [])

    const unsubscribe = (sub_id) => {
        fetch(`http://localhost:3000/subscriptions/${sub_id}`, {
            method:'DELETE'
        })
            .then(()=> setSubscriptions(subscriptions.filter(subscription => subscription.id !== sub_id)))
    }

    const podcastComps = subscriptions.map(subscription => <Podcast unsubscribe={unsubscribe} sub_id={subscription.id} podcast={subscription.podcast} key={subscription.podcast.title} setCurrentTrack={setCurrentTrack}/>)
    
    return (
        <>
            {podcastComps}
        </>
    )
}

export default MyPodcasts;