import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'

const AddPodcast = ({user, setMessage}) => {
    const [title, setTitle] = useState("")
    const [rssFeed, setRssFeed] = useState("")
    const history = useHistory()
    const trackPodcast = () => {
        
        const podcast = {
            title: title,
            rss_feed: rssFeed
        }
        console.log(podcast)

        fetch(`http://localhost:3000/subscriptions`, {
            method: "POST", 
            headers: {
                'Content-Type':"application/json",
                Accept:'application/json'
            },
            body: JSON.stringify({podcast, user})
        })
            .then(r => r.json())
            .then(newPod => {
                setMessage({msg: `Subscribed to ${newPod.title}`, severity:"success"})
                history.pushState("/mypodcasts")
            })
    }

    return (
        <form className="add-podcast" onSubmit={trackPodcast}>
            <input type="text" value={title} placeholder="Enter Podcast Title" onChange={e=>setTitle(e.target.value)}/>
            <br />
            <input type="text" value={rssFeed} placeholder="Add RSS Feed URL" onChange={e=>setRssFeed(e.target.value)}/>
            <br />
            <input type="submit" value="Add Podcast"/>
        </form>
    )
}

export default AddPodcast;