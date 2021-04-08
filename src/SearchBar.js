import React, {useState} from "react"

const SearchBar = ({handleSearch}) => {
    const [search, setSearch] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        handleSearch(search)
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Search Podcasts:
                <input type="text" value={search} onChange={e=>setSearch(e.target.value)}/>
            </label>
            <input type="submit" value="Search"/>
        </form>
    )
}

export default SearchBar;