import React from "react"
import { NavLink, useHistory} from "react-router-dom"

const Navbar = ({setUser}) => {
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

            <NavLink to="/login" onClick={()=> setUser(false)}>
              Log Out
            </NavLink>

        </aside>
    )
}

export default Navbar;