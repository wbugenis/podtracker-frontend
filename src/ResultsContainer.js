import React from "react"
import Result from "./Result"

const ResultsContainer = ({user, results, setMessage, subscriptions}) => {
    const resultsArr = results.map(result=> 
    <Result 
        user={user} 
        result={result} 
        key={result.collectionId} 
        setMessage={setMessage} 
        subscriptions={subscriptions}
    />)

    return <ul>{resultsArr}</ul>
}

export default ResultsContainer;