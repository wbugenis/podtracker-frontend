import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = ({setUser}) => {
    const userEpId = useSelector(state => state.episodes.epId); 

    const logout = () => {
        localStorage.removeItem("token");
        setUser({id: null});
    }

    return (
        <aside>
            <p>Episode ID: {userEpId}</p>
            
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