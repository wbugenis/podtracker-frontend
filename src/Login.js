import React, {useState} from "react"
import {Link} from "react-router-dom"

const Login = ({handleLogin}) =>{
    const [username, setUsername] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        handleLogin(username)
    }

    return (
        <>
            <h1 style={{fontStyle:'italic'}}>podtracker</h1>
            <h3 style={{marginLeft:'50px'}}>Login</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text" value={username} placeholder="Enter Your Name" onChange={e=>setUsername(e.target.value)}/>
                    <input type="submit" value="Login"/>
                </label>
            </form>
            <br />
            <Link style={{marginLeft:'50px'}} to="/signup">Register</Link>
        </>
    )
}

export default Login;