import React, {useState} from "react"

const SearchBar = ({handleSearch}) => {
    const [search, setSearch] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        handleSearch(search)
    }

    return (
        <>  
            <form onSubmit={handleSubmit} style={{textAlign:'center'}}>
            <h1>iTunes Podcast Search</h1>
                <label>
                    Search Podcasts:
                    <input type="text" value={search} onChange={e=>setSearch(e.target.value)}/>
                </label>
                <input type="submit" value="Search"/>
            </form>
        </>
    )
}

export default SearchBar;