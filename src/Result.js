import React, {useState} from "react"

const Result = ({result}) => {
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

        fetch("http://localhost:3000/podcasts", {
            method: "POST", 
            headers: {
                'Content-Type':"application/json",
                Accept:'application/json'
            },
            body: JSON.stringify(podcast)
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
                    <a href={info.homepage} target="_blank">Podcast Homepage</a>
                </>
            }
            <br />
            <button onClick={trackPodcast}>Track Podcast</button>
        </li>
    )
}

export default Result;