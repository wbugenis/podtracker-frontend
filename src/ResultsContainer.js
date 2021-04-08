import React, {useState} from "react"
import Result from "./Result"

const ResultsContainer = ({results}) => {
    const resultsArr = results.map(result=> <Result result={result} key={result.collectionId} />)

    return <ul>{resultsArr}</ul>
}

export default ResultsContainer;