import React, {useState} from "react"
import {Switch, Route, Redirect} from "react-router-dom"

import Navbar from './Navbar'
import Search from './Search'
import MyPodcasts from './MyPodcasts'
import Login from './Login'
import Signup from './Signup'

function App() {
  const [user, setUser] = useState(false)

  const handleLogin = (username) =>{
      fetch("http://localhost:3000/login", {
          method: "POST",
          headers: {
            'Content-Type':'application/json',
            Accept:'application/json'
          },
          body: JSON.stringify({username: username})
      })
            .then(r => r.json())
            .then(user => {
              if (user){
                setUser(user)
              } else {
                alert("Try again")
              }
            })
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
          .then(r => r.json())
          .then(user => setUser(user))
  }

  return (
    <>
    {user ? 
      <div className="main">
        <Navbar setUser={setUser}/>
        <section>
          <Switch>
            <Route exact path ="/mypodcasts">
              <MyPodcasts />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route exact path="/settings">
              {/* <Settings /> */}
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
