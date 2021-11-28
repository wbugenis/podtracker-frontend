import React from "react";
import { NavLink } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { setDisplay, setInfo, setEpisodeList } from '../../redux/podSlice';
import { setUserEpisodes } from '../../redux/epSlice';

const Navbar = ({setUser}) => {
    const dispatch = useDispatch();

    //Clears localstorage token, reverts Redux store to initial values, clears User state
    const logout = () => {
        localStorage.removeItem("token");
        dispatch(setDisplay("none"));
        dispatch(setInfo({
            id: null,
            podcast_img_url: "",
            title: "",
            description: "",
        }));
        dispatch(setEpisodeList([]));
        dispatch(setUserEpisodes([]));
        setUser(null);
    }

    return (
        <aside>
            
            <NavLink to="/mypodcasts" className="navlink">
                My Podcasts
            </NavLink>
          
            <br/>

            <NavLink to="/search" className="navlink" >
                Search
            </NavLink>
        
            <br/>

            <NavLink to="/addpodcast" className="navlink">
                Add Podcast RSS Feed
            </NavLink>
            
            <br />

            <NavLink to="/login" className={"navlink"} onClick={()=> logout()}>
                Log Out
            </NavLink>

        </aside>
    )
}

export default Navbar;