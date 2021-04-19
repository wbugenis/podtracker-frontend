import React from "react"
import Result from "./Result"

const ResultsContainer = ({user, results, setMessage}) => {
    const resultsArr = results.map(result=> 
    <Result user={user} result={result} key={result.collectionId} setMessage={setMessage} />)

    return <ul>{resultsArr}</ul>
}

export default ResultsContainer;