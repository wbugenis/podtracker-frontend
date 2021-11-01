import React, {useState} from "react";
import { Link } from "react-router-dom";

const Signup = ({setUser}) =>{
    const url = process.env.REACT_APP_RAILS_URL;
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const handleSignup = (event) =>{
        event.preventDefault();
        let fetchUrl = url + 'users';
        fetch(fetchUrl, {
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
            .catch((response) =>{

                if(response.toString().includes("TypeError")){
                    response = {errors: ["Server Error"]}
                }
                
                setErrors(response.errors);
            });
    };
        
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
    );
};

export default Signup;