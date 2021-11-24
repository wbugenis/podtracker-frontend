import React, {useState} from "react";
import SearchBar from "./SearchBar";
import ResultsContainer from "./ResultsContainer";

const Search = ({user, setMessage, subscriptions}) => {
    const url = process.env.REACT_APP_RAILS_URL;
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    const handleSearch = (search) => {
        setResults([]);
        setSearchTerm(search);
        // let fetchUrl = url + '/search/' + search;
        fetch(`${url}/search/${search}`)
            .then(r => r.json())
            .then(resultsObj => setResults(resultsObj.results))
    }

    return (
        <div style={{justifyContent:'center'}}>
            <SearchBar handleSearch={handleSearch} />
            {searchTerm === "" ? null : 
            <>
                <h2>Search results for "{searchTerm}"</h2>
                <br />
                <ResultsContainer 
                    user={user} 
                    results={results} 
                    searchTerm={searchTerm} 
                    setMessage={setMessage} 
                    subscriptions={subscriptions} 
                />
            </>
            }
        </div>
    );
    
};

export default Search;