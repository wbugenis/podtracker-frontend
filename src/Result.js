import React, {useEffect, useState} from "react";

const Result = ({user, result, setMessage, subscriptions}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    const reactURL = process.env.REACT_APP_FRONT_URL;
    
    const [info, setInfo] = useState({description: "", homepage:""});
    const [showMore, setShowMore] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    //Check if user is already subscribed to any of podcasts in search results by RSS URL
    useEffect(()=>{
        subscriptions.forEach(subscription => {
            if( subscription.podcast.rss_feed === result.feedUrl ){
                setSubscribed(true);
            };
        });
    }, []);
    
    //Handle "show info" click - get podcast info and display
    const showInfo = () => {
        getInfo();
        setShowMore(true);
    }

    //Fetch info not available from iTunes from podcast's RSS feed
    const getInfo = () => {
        const rss = result.feedUrl;
        let fetchUrl = url + 'search/info';
        fetch(fetchUrl, {
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
    const trackPodcast = async () => {
        
        //Get description/homepage for saving to DB if not shown on page yet
        if(!showMore){
            await getInfo();
        }

        const podcast = {
            title: result.collectionName,
            rss_feed: result.feedUrl.replace(reactURL, ''),
            podcast_img_url: result.artworkUrl600.replace(reactURL, ''),
            description: info.description.replace(/(<([^>]+)>)/gi, ""),
            podcast_home_url: info.homepage.replace(reactURL, ''),
        };

        let fetchUrl = url + 'subscriptions';

        fetch(fetchUrl, {
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
        <div className='description'>
            <img src={result.artworkUrl100} alt={result.collectionName}/>
            <div className='description-text'>
                <span style={{display:'inline-flex'}}>
                    <h2 style={{margin: '5px 0px 10px 0px'}}>{result.collectionName}</h2>
                    <a href={result.feedUrl} target="_blank" rel="noreferrer" className="material-icons" style ={{textDecoration:"none"}}>rss_feed</a>
                </span>
                <div>{subscribed ? 
                        <button disabled>Subscribed</button> 
                    : 
                        <button onClick={trackPodcast}>Track Podcast</button>
                    }
                </div>
                <br />
                <div>
                    {!showMore ? 
                        <button onClick={showInfo}>Show Info</button> 
                    :
                        <div>

                            <p style={{margin: '2px 2px 2px 2px'}}>
                                {info.description ? 
                                    info.description.replace(/(<([^>]+)>)/gi, "") 
                                : 
                                    "" 
                                }
                            </p>

                            <p>
                            {info.homepage ? 
                                    <a href={info.homepage} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    style={{margin:'0px 15px 0px 15px'}}>
                                        Homepage
                                    </a> 
                                : 
                                    ""
                            }
                            </p>

                        </div>
                    }
                </div>
            </div>
        </div>   
    )
}

export default Result;