import React, {useState, useEffect} from "react";
import Podcast from "./Podcast";
import Grid from '@material-ui/core/Grid';

const MyPodcasts = ({user, setPlaylist, setMessage, subscriptions, setSubscriptions}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    const [podInfo, setPodInfo] = useState(null);
    const [podEpisodes, setPodEpisodes] = useState(null);
    const [podcastDisplay, setPodcastDisplay] = useState("flex");
   
    //Retrieve all of user's subscribed podcasts
    useEffect(()=> {
        let fetchUrl = url + 'user/' + user.id + '/subscriptions'
        fetch(fetchUrl)
            .then(r => r.json())
            .then(subscriptions => {
                setSubscriptions(subscriptions);
            })
    }, [])

    const togglePodcastDisplay = () => {
        if(podcastDisplay === "flex"){
            setPodcastDisplay("none");
        } 
        else {
            setPodcastDisplay("flex")
        }
    }

    //Unsubscribe from podcast
    const unsubscribe = (title, sub_id) => {
        let fetchUrl = url + 'subscriptions/' + sub_id;
        fetch(fetchUrl, {
            method:'DELETE'
        })
            .then(()=> {
                setSubscriptions(subscriptions.filter(subscription => subscription.id !== sub_id));
                setMessage({msg:`Unsubscribed from - ${title}`, severity:"error"});
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
            setPodInfo={setPodInfo}
            setPodEpisodes={setPodEpisodes}
            togglePodcastDisplay={togglePodcastDisplay}
        />
    );

    return (
        <> 
            {subscriptions.length > 0 ? 
                <>
                    <div onClick={()=>togglePodcastDisplay()} style={{textAlign:"center"}}>
                    {podcastDisplay === 'flex' ? 
                        <span className="material-icons">
                        expand_less 
                        </span>
                    : 
                        <span className="material-icons">
                            expand_more
                        </span>}  
                    Podcasts
                    </div>
                    
                    <Grid 
                        className='podcast-grid' 
                        style={{
                            maxWidthXs:'245px',
                            display: podcastDisplay,
                            flexBasis:'unset',
                            flexWrap:'nowrap', 
                            width:'1000px', 
                            margin:'0px', 
                            padding:'5px 10px 0px 10px'    
                        }}
                    >
                        {podcastComps} 
                    </Grid>
                     
                </>
            :
                <h2>You haven't subscribed to any podcasts yet!</h2>
            }
            <div id="podcast-detail">
                {podInfo}
                {podEpisodes}
            </div>
        </>
    )
}

export default MyPodcasts;