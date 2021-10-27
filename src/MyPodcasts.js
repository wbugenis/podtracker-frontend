import React, {useState, useEffect} from "react";
import Podcast from "./Podcast";
import Grid from '@material-ui/core/Grid';

const MyPodcasts = ({user, setPlaylist, setMessage, subscriptions, setSubscriptions}) => {
    const [podComponents, setPodComponents] = useState(null);
    const [podcastDisplay, setPodcastDisplay] = useState("flex");
   
    //Retrieve all of user's subscribed podcasts
    useEffect(()=> {
        fetch(`http://localhost:3000/user/${user.id}/subscriptions`)
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
        fetch(`http://localhost:3000/subscriptions/${sub_id}`, {
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
            setPodComponents={setPodComponents}
            togglePodcastDisplay={togglePodcastDisplay}
        />
    );

    return (
        <> 
            {subscriptions.length > 0 ? 
                <>
                    <div onClick={()=>togglePodcastDisplay()}>
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
                        container spacing={4} 
                        className='podcast-grid' 
                        style={{
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
                {podComponents}
            </div>
        </>
    )
}

export default MyPodcasts;