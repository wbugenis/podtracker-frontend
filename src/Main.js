import React, {useState, useEffect } from "react"
import { Switch, Route, Redirect, useHistory } from "react-router-dom"
import { Snackbar, Fade } from '@material-ui/core'
import { Alert } from '@material-ui/lab/'

import Navbar from './Navbar'
import Search from './Search'
import MyPodcasts from './MyPodcasts'
import Login from './Login'
import Signup from './Signup'
import Player from './Player'
import AddPodcast from './AddPodcast'

const Main = ({setPlaylist}) => {
    const [user, setUser] = useState({id: null})
    const [message, setMessageText] = useState({msg:"", severity:""})
    const [showSnack, setShowSnack] = useState(false)
    const [subscriptions, setSubscriptions] = useState([])
    const history = useHistory()
    console.log(user)
    
    const setMessage = (newMessage) =>{
      setMessageText(newMessage)
      setShowSnack(true)
    }
  
    useEffect(() => {
      if (!localStorage.getItem("token")) {
        history.push("/login");
      }
    }, [])
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        fetch(`http://localhost:3000/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((r) => {
            return r.json()
          })
          .then((user) => {
            setUser(user)
          })
          .catch(error => console.log(error))
      }
    }, []);
  
    const snackClose = () => {
      setMessageText({msg:"", severity:""})
      setShowSnack(false)
    }

    return (
    <div className="main">
        <Snackbar 
          open={showSnack}
          autoHideDuration={3000}
          onClose={snackClose}
          TransitionComponent={Fade}
          key={message.msg}
          anchorOrigin={{ vertical:'top', horizontal:'center'}}>
          <Alert severity={message.severity}>
            {message.msg}
          </Alert>
        </Snackbar>

        {user && user.id ? 
        <>
          <div className="logo">
            <h2 style={{marginLeft: '20px', fontStyle:"italic"}}>podtracker</h2>
          </div>
          <Navbar setUser={setUser}/> 
          <Player /> 
          <section> 
            <Switch>
              <Route exact path ="/mypodcasts">
                <MyPodcasts 
                  user={user} 
                  setPlaylist={setPlaylist} 
                  setMessage={setMessage} 
                  subscriptions={subscriptions} 
                  setSubscriptions={setSubscriptions}
                />
              </Route>
              <Route exact path="/search">
                <Search user={user} setMessage={setMessage} subscriptions={subscriptions} />
              </Route>
              <Route exact path="/addpodcast">
                <AddPodcast 
                  user={user} 
                  subscriptions={subscriptions} 
                  setSubscriptions={setSubscriptions} 
                />
              </Route>
              <Route exact path="/*">
                <Redirect to={{pathname: "/mypodcasts"}} />
              </Route>
            </Switch>
          </section>
        </>
        :
        <div className="welcome-div">
          <h1 style={{fontStyle:'italic'}}>podtracker</h1>
          <Switch>
            <Route exact path="/login">
              <Login setUser={setUser} setMessage={setMessage} />
            </Route>
            <Route exact path="/signup">
              <Signup setUser={setUser} setMessage={setMessage} />
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