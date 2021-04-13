import React, {useState} from "react"

const Result = ({user, result}) => {
    const [info, setInfo] = useState({description: "", homepage:""})

    //Fetch info not available from iTunes from podcast's RSS feed
    const showInfo = () => {
        const rss = result.feedUrl
        console.log("getting info")
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
            rss_feed: result.feedUrl,
            podcast_img_url: result.artworkUrl600,
            description: info.description,
            podcast_home_url: info.homepage
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
            .then(newPod => console.log(`now tracking ${newPod.title}`))
    }

    return (
        <li>
            <h1>{result.collectionName}</h1>
            <img src = {result.artworkUrl100} alt = {result.collectionName} />
            
            {info.description==="" ? 
                <button onClick={showInfo}>More Info?</button> 
            :
                <>
                    <p>{info.description}</p>
                    <a href={info.homepage} target="_blank" rel="noreferrer">Podcast Homepage</a>
                </>
            }
            <br />
            <button onClick={trackPodcast}>Track Podcast</button>
            <a href={result.feedUrl}>rss</a>
        </li>
    )
}

export default Result;