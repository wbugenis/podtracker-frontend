import React, {useState, useEffect } from "react"
import {Switch, Route, Redirect, useHistory} from "react-router-dom"

import Navbar from './Navbar'
import Search from './Search'
import MyPodcasts from './MyPodcasts'
import Login from './Login'
import Signup from './Signup'
import Player from './Player'

function App() {
  const [user, setUser] = useState({id:null})
  const [currentTrack, setCurrentTrack] = useState({title:"", src: "", type: ""})
  const history = useHistory()
  console.log(user)

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      console.log("no token")
      history.push("/login");
    }
  }, [])

  useEffect(() => {
    
    const token = localStorage.getItem("token");
    console.log("got token")
    if (token) {
      console.log(token)
      fetch(`http://localhost:3000/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((r) => r.json())
        .then((user) => {
          setUser(user);

          console.log(user);
        });
    }
  }, []);

  return (
    <div className="main">
      {user.id ? <>
        <div className="logo">
          <h1 style={{fontStyle:"italic"}}>podtracker</h1>
        </div>
        <Navbar setUser={setUser}/> 
        <Player currentTrack={currentTrack} setCurrentTrack={setCurrentTrack}/>
        <section> 
          <Switch>
            <Route exact path ="/mypodcasts">
              <MyPodcasts user={user} setCurrentTrack={setCurrentTrack}/>
            </Route>
            <Route exact path="/search">
              <Search user={user}/>
            </Route>
            <Route exact path="/settings">
              {/* <Settings /> */}
            </Route>
            <Route exact path="/*">
              <Redirect to={{pathname: "/mypodcasts"}} />
            </Route>
          </Switch>
        </section>
        </>
      :
      <div className="welcome-div">
        <h1 style={{fontStyle:'italic', color:"forestgreen"}}>podtracker</h1>
        <Switch>
          <Route exact path="/login">
            <Login setUser={setUser}/>
          </Route>
          <Route exact path="/signup">
            <Signup setUser={setUser}/>
          </Route>
          <Route exact path="/*">
              <Redirect to={{pathname: "/login"}}/>
          </Route>
        </Switch>
      </div>
      }
    </div>
  );
}

export default App;
