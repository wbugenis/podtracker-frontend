import React, {useEffect, useState} from "react";

const Result = ({user, result, setMessage, subscriptions}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    const reactURL = process.env.REACT_APP_FRONT_URL;
    const [info, setInfo] = useState({description: "", homepage:""});
    const [subscribed, setSubscribed] = useState(false);
    useEffect(()=> showInfo(), []);

    //Check if user is already subscribed to any of podcasts in search results by RSS URL
    useEffect(()=>{
        subscriptions.forEach(subscription => {
            if( subscription.podcast.rss_feed === result.feedUrl ){
                setSubscribed(true);
            };
        });
    }, []);

    //Fetch info not available from iTunes from podcast's RSS feed
    const showInfo = () => {
        const rss = result.feedUrl;
        fetch(`${url}search/info`, {
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
            rss_feed: result.feedUrl.replace(reactURL, ''),
            podcast_img_url: result.artworkUrl600.replace(reactURL, ''),
            description: info.description.replace(/(<([^>]+)>)/gi, ""),
            podcast_home_url: info.homepage.replace(reactURL, ''),
        };

        fetch(`${url}subscriptions`, {
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
    };

    return (
        <>
            <div className='description'>
                <img src={result.artworkUrl100} alt={result.collectionName}/>
                <div className='description-text'>
                    <h2 style={{margin: '5px 0px 5px 0px'}}>{result.collectionName}</h2>
                    <p style={{margin: '2px 2px 2px 2px'}}>{info.description ? info.description.replace(/(<([^>]+)>)/gi, "") : ""}</p>
                    <br />
                    <span style={{display:'inline-flex'}}>
                        <div>{subscribed ? <button disabled>Subscribed</button> : <button onClick={trackPodcast}>Track Podcast</button>}</div>
                        {info.homepage && !info.homepage.includes(reactURL) ? <a href={info.homepage} target="_blank" rel="noreferrer" style={{margin:'0px 15px 0px 15px'}}>Podcast Homepage</a> : <div>Homepage Unavailable</div>}
                        <a href={result.feedUrl}>RSS Feed</a>
                    </span>
                </div>
            </div> 
        </>
    )
}

export default Result;