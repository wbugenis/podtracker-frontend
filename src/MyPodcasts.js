import React, {useState, useEffect} from "react";
import Podcast from "./Podcast";
import PodcastInfo from "./PodcastInfo";
import Grid from '@material-ui/core/Grid';

import { useDispatch} from 'react-redux';
import { setUserEpisodes } from './redux/epSlice';

const MyPodcasts = ({user, setPlaylist, setMessage, subscriptions, setSubscriptions}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    const [podcastDisplay, setPodcastDisplay] = useState("flex");

    const dispatch = useDispatch();

    //Retrieve all of user's subscribed podcasts
    const subsUrl = url + 'user/' + user.id + '/subscriptions';
    useEffect(()=> {
        fetch(subsUrl)
            .then(r => r.json())
            .then(subscriptions => {
                setSubscriptions(subscriptions);
            })

    //Retrieve all of user's userepisodes
    let fetchUserEps = url + 'user_episodes/all/' + user.id;
    fetch(fetchUserEps)
        .then(r => r.json())
        .then(userEps => dispatch(setUserEpisodes(userEps)))

    }, [])


    //Shows or hides podcast selection bar/carousel
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
            togglePodcastDisplay={togglePodcastDisplay}
        />
    );

    return (
        <> 
            {subscriptions.length > 0 ? 
                <>
                    <div 
                        onClick={()=>togglePodcastDisplay()} 
                        style={{textAlign:"center", fontWeight:"bold", fontSize: "25px"}}
                    >

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

            <PodcastInfo 
                user={user}
                setPlaylist={setPlaylist}
                setMessage={setMessage}
            />
        </>
    )
}

export default MyPodcasts;