import React, {useState} from "react"
import { Link } from "react-router-dom"

const Login = ({setUser}) =>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState("")

    const handleLogin = (event) =>{
        event.preventDefault()

        fetch("http://localhost:3000/login", {
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
                const { user, token } = response;
                localStorage.setItem("token", token);
                setUser(user);
            })
            .catch((response) => {
                console.log(response)
                if(response.toString().includes("TypeError")){
                    response = {errors: ["Server Error"]}
                }
                setErrors(response.errors)
            });
      }
           
    return (
        <>
            <h3 style={{marginLeft:'50px'}}>Login</h3>
            <form onSubmit={handleLogin}>                
                    <input type="text" value={username} placeholder="Enter Your Name" onChange={e=>setUsername(e.target.value)}/>
                    <br/>
                    <input type="password" value={password} placeholder="Choose a password" onChange={e=>setPassword(e.target.value)}/>
                    <br />
                    <input type="submit" value="Login"/>
            </form>
            <br />
            {errors.length !== 0 ? (
                <>
                {errors.map((er, i) => (
                    <div key={i}>{er}</div>
                ))}
                </>
            ) : null}
            <Link style={{marginLeft:'50px'}} to="/signup">Register</Link>
        </>
    )
}

export default Login;