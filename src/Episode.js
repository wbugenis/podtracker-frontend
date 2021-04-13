import React, {useState} from "react"

const Episode = ({episode, setCurrentTrack}) => {
    const [showDesc, setShowDesc] = useState(false)

    const {title, description, runtime, filepath, filetype, pubDate} = episode
    
    return <li>
        <div>{title}</div>
        <div onClick={()=>setShowDesc(!showDesc)}>+ {showDesc ? <>{description}</> : null } </div>
        <div>{runtime} | {pubDate}</div>
        <div onClick={()=>setCurrentTrack({title:title,src:filepath, type:filetype})}>PLAY</div>
        <br/>
    </li>
}

export default Episode;