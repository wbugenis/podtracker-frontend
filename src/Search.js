import React, {useState} from "react"
import SearchBar from "./SearchBar"
import ResultsContainer from "./ResultsContainer"

const Search = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [results, setResults] = useState([])

    const handleSearch = (search) => {
        setSearchTerm(search) 
        fetch(`http://localhost:3000/search/${search}`)
            .then(r => r.json())
            .then(resultsObj => {
                console.log(resultsObj)
                setResults(resultsObj)
            })
    }

    return (
        <div>
            <SearchBar handleSearch={handleSearch} />
            {searchTerm === "" ? null : 
            <>
                <h2>Search results for "{searchTerm}"</h2>
                <ResultsContainer results={results} searchTerm={searchTerm} />
            </>
            }
        </div>
    )
    
}

export default Search;