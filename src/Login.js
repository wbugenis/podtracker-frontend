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
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input type="text" value={username} onChange={e=>setUsername(e.target.value)}/>
                    <input type="submit" value="Login"/>
                </label>
            </form>
            <Link to="/signup">Register</Link>
        </>
    )
}

export default Login;