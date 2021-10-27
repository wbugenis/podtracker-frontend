import React, {useState} from "react";
import { Link } from "react-router-dom";

const Login = ({setUser, setMessage}) =>{
    const url = process.env.REACT_APP_RAILS_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    console.log(url)
    const handleLogin = (event) =>{
        event.preventDefault();

        fetch(`${url}+login`, {
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
                console.log(response);
                if(response.toString().includes("TypeError")){
                    response = {errors: ["Server Error"]};
                };
                if(response.errors){
                    const errorMsgs = response.errors.join('\n');
                    setMessage({msg: errorMsgs, severity:"error"});
                };
            });
      }
           
    return (
        <>
            <h3>Login</h3>
            <form onSubmit={handleLogin}>                
                    <input type="text" value={username} placeholder="Enter Your Name" onChange={e=>setUsername(e.target.value)}/>
                    <br/>
                    <input type="password" value={password} placeholder="Choose a password" onChange={e=>setPassword(e.target.value)}/>
                    <br />
                    <input type="submit" value="Login"/>
            </form>
            <Link to="/signup">Register</Link>
        </>
    )
}

export default Login;