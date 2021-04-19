import React from "react"
import { NavLink } from "react-router-dom"

const Navbar = ({setUser}) => {

    const logout = () => {
        localStorage.removeItem("token");
        setUser({id: null})
    }

    return (
        <aside>
            <NavLink to="/mypodcasts" className="navlink">
                My Podcasts
            </NavLink>
            <br/>
            <NavLink to="/search" className="navlink">
                Search
            </NavLink>

            {/* <NavLink to="/settings" className="navlink">
                Settings
            </NavLink> */}

            <NavLink to="/login" onClick={()=> logout()}>
              Log Out
            </NavLink>

        </aside>
    )
}

export default Navbar;