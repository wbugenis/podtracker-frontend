import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const AddPodcast = ({user, setMessage}) => {
    const [title, setTitle] = useState("");
    const [rssFeed, setRssFeed] = useState("");
    const history = useHistory();
    const trackPodcast = () => {
        
        const podcast = {
            title: title,
            rss_feed: rssFeed
        }

        //Post new podcast subscription to DB for the logged in user
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
                // Jump to podcast display page after subscription
                history.pushState("/mypodcasts")
            })
    }

    return (
        <div className="add-podcast" style={{textAlign:'center'}}>
            <form  onSubmit={trackPodcast} >
                <h1>RSS Subscription Form</h1>
                <p>Can't find your podcast on iTunes, but have an RSS feed link? Enter it here!</p>
                <input type="text" value={title} placeholder="Enter Podcast Title" onChange={e=>setTitle(e.target.value)}/>
                <br />
                <input type="text" value={rssFeed} placeholder="Add RSS Feed URL" onChange={e=>setRssFeed(e.target.value)}/>
                <br />
                <input type="submit" value="Add Podcast"/>
            </form>
        </div>
    )
}

export default AddPodcast;