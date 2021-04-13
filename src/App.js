import React, {useState} from "react"
import {Switch, Route, Redirect} from "react-router-dom"

import Navbar from './Navbar'
import Search from './Search'
import MyPodcasts from './MyPodcasts'
import Login from './Login'
import Signup from './Signup'
import Player from './Player'

function App() {
  const [user, setUser] = useState(false)
  const [currentTrack, setCurrentTrack] = useState({title:"", src: "", type: ""})

  const handleLogin = (username) =>{
      fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            'Content-Type':'application/json',
            Accept:'application/json'
          },
          body: JSON.stringify({username: username})
      })
            .then(r => {
              console.log(r)
              return r.json().then((data) => {
                if (r.ok) {
                  return data
                } else {
                  console.log("not ok", data)
                  throw data
                }
              })
            })
            .then(user => {
              console.log(user)
              if (user){
                setUser(user)
              } else {
                alert("Try again")
              }
            })
            .catch(data => console.log(data))
  }

  const handleSignup = (username) =>{
    fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          'Content-Type':'application/json',
          Accept:'application/json'
        },
        body: JSON.stringify({username: username})
    })
        .then(r => {
          return r.json().then((data) => {
            if (r.ok) {
              console.log("ok", data)
              return data
            } else {
              console.log("not ok", data)
              throw data
            }
          })
        })
        .then(user => {
          console.log("2nd then", user)
          if (user){
            setUser(user)
          } else {
            alert("Try again")
          }
        })
        .catch(data => console.log(data))
  }

  return (
    <>
    {user ? 
      <div className="main">
        <Navbar setUser={setUser}/> 
        <section> 
          <Player currentTrack={currentTrack} setCurrentTrack={setCurrentTrack}/>
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
      </div>
      :
      <div className="welcome-div">
        <Switch>
          <Route exact path="/login">
            <Login handleLogin={handleLogin}/>
          </Route>
          <Route exact path="/signup">
            <Signup handleSignup={handleSignup}/>
          </Route>
          <Route exact path="/*">
              <Redirect to={{pathname: "/login"}}/>
          </Route>
        </Switch>
      </div>
      }
    </>
  );
}

export default App;
