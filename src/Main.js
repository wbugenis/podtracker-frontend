import React, {useState, useEffect } from "react"
import { Switch, Route, Redirect, useHistory } from "react-router-dom"

import { usePlayerContext } from '@cassette/hooks'
import { Snackbar, Fade } from '@material-ui/core'
import { Alert } from '@material-ui/lab/'

import Navbar from './Navbar'
import Search from './Search'
import MyPodcasts from './MyPodcasts'
import Login from './Login'
import Signup from './Signup'
import Player from './Player'
import PlayerContextUser from './PlayerContextUser'

const Main = ({setPlaylist}) => {
    const [user, setUser] = useState({id: null})
    const [message, setMessageText] = useState("")
    const [showSnack, setShowSnack] = useState(false)
    const {paused, onTogglePause, playlist} = usePlayerContext(['paused', 'onTogglePause', 'playlist'])
    const history = useHistory()
    console.log(user)
    
    const setMessage = (message) =>{
      setMessageText(message)
      setShowSnack(true)
    }
  
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
          .then((r) => {
            console.log(r)
            return r.json()
          })
          .then((user) => {
            console.log(user)
            setUser(user)
          })
          .catch(error => console.log(error))
      }
    }, []);
  
    const playTrack = (episode) => {
        setPlaylist([episode].concat(playlist.slice(1)))
        console.log(playlist)
        console.log(paused)
        setTimeout(()=> onTogglePause(false), 500)
        console.log(paused) 
    }
  
    const queueTrack = (episode) => {
        console.log(episode)
        console.log(playlist)
        setPlaylist(playlist.concat(episode))
    }

    const snackClose = () => {
      setMessageText("")
      setShowSnack(false)
    }

    return (
    <div className="main">
        <Snackbar 
          open={showSnack}
          autoHideDuration={3000}
          onClose={snackClose}
          TransitionComponent={Fade}
          key={message}
          anchorOrigin={{ vertical:'top', horizontal:'center'}}>
          <Alert severity={"success"}>
            {message}
          </Alert>
        </Snackbar>

        {user && user.id ? 
        <>
          <div className="logo">
            <h1 style={{fontStyle:"italic"}}>podtracker</h1>
          </div>
          <Navbar setUser={setUser}/> 
          <Player />
          
          <section> 
            <PlayerContextUser />
            <Switch>
              <Route exact path ="/mypodcasts">
                <MyPodcasts user={user} playTrack={playTrack} queueTrack={queueTrack} />
              </Route>
              <Route exact path="/search">
                <Search user={user} setMessage={setMessage} />
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
    )
}

export default Main;