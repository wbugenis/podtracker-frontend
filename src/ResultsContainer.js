import React, {useState} from "react"
import Result from "./Result"

const ResultsContainer = ({user, results}) => {
    const resultsArr = results.map(result=> <Result user={user} result={result} key={result.collectionId} />)

    return <ul>{resultsArr}</ul>
}

export default ResultsContainer;