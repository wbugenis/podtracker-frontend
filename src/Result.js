import React, {useEffect, useState} from "react"

const Result = ({user, result, setMessage, subscriptions}) => {
    const [info, setInfo] = useState({description: "", homepage:""})
    const [subscribed, setSubscribed] = useState(false)
    useEffect(()=> showInfo(), [])

    useEffect(()=>{
        subscriptions.forEach(subscription => {
            if( subscription.podcast.rss_feed === result.feedUrl ){
                setSubscribed(true)
            }
        })
    }, [])

    //Fetch info not available from iTunes from podcast's RSS feed
    const showInfo = () => {
        const rss = result.feedUrl
        fetch("http://localhost:3000/search/info", {
            method: "POST",
            headers: {
                'Content-Type':'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({rss})
        })
            .then(r => r.json())
            .then(fetchedInfo => setInfo(fetchedInfo))
    }
    
    //Save podcast to DB for tracking
    const trackPodcast = () => {
        
        const podcast = {
            title: result.collectionName,
            rss_feed: result.feedUrl.replace('http://localhost:4000/', ''),
            podcast_img_url: result.artworkUrl600.replace('http://localhost:4000/', ''),
            description: info.description,
            podcast_home_url: info.homepage.replace('http://localhost:4000/', ''),
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
                setSubscribed(true)
            })
    }

    return (
        <>
            <div className='description'>
                <img src={result.artworkUrl100} alt={result.collectionName}/>
                <div class='description-text'>
                    <h2 style={{margin: '5px 0px 5px 0px'}}>{result.collectionName}</h2>
                    <p style={{margin: '2px 2px 2px 2px'}}>{info.description}</p>
                    <br />
                    <span style={{display:'inline-flex'}}>
                        <div>{subscribed ? <button disabled>Subscribed</button> : <button onClick={trackPodcast}>Track Podcast</button>}</div>
                        <a href={info.homepage} target="_blank" rel="noreferrer" style={{margin:'0px 15px 0px 15px'}}>Podcast Homepage</a>
                        <a href={result.feedUrl}>RSS Feed</a>
                    </span>
                </div>
            </div> 
        </>
    )
}

export default Result;