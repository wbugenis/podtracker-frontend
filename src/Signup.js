import React, {useState} from "react"
import { Link } from "react-router-dom"

const Signup = ({setUser}) =>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState([]) 
    console.log("errors is", errors)

    const handleSignup = (event) =>{
        event.preventDefault()
        console.log(username, password)
        fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
              'Content-Type':'application/json',
              Accept:'application/json'
            },
            body: JSON.stringify({username, password})
        })
            .then((r) => {
                return r.json().then((data) => {
                    if (r.ok) {
                        return data;
                    } else {
                        throw data;
                    }
                });
            })
            .then((response) => {
                console.log(response)
                const { user, token } = response;
                localStorage.setItem("token", token);
                setUser(user);
            })
            .catch((response) =>{
                console.log(response)
                if(response.toString().includes("TypeError")){
                    response = {errors: ["Server Error"]}
                }
                console.log(response)
                setErrors(response.errors)
             } );
    }
        
    return (
        <>
            <h4>Registration Form</h4>

            <form onSubmit={handleSignup}>
                <input type="text" value={username} placeholder="Choose a username" onChange={e=>setUsername(e.target.value)}/>
                <br />
                <input type="password" value={password} placeholder="Choose a password" onChange={e=>setPassword(e.target.value)}/>
                <br />
                <input type="submit" value="Register"/>
            </form>

            <br />
            {errors.length !== 0 ? (
                <>
                {errors.map((er, i) => (
                    <div key={i}>{er}</div>
                ))}
                </>
            ) : null}
            <Link to="/login">Login</Link>
        </>
    )
}

export default Signup;