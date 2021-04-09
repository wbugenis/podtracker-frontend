import React, {useState} from "react"

const Signup = ({handleSignup}) =>{
    const [username, setUsername] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        handleSignup(username)
    }

    return (
        <>
            <h1>Registration Page</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Name
                    <input type="text" value={username} onChange={e=>setUsername(e.target.value)}/>
                    <input type="submit" value="Register"/>
                </label>
            </form>
        </>
    )
}

export default Signup;