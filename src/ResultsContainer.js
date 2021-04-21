import React from "react"
import Result from "./Result"
import { Grid } from "@material-ui/core"

const ResultsContainer = ({user, results, setMessage, subscriptions}) => {
    const resultsArr = results.map(result=> 
    <Result 
        user={user} 
        result={result} 
        key={result.collectionId} 
        setMessage={setMessage} 
        subscriptions={subscriptions}
    />)
        console.log(resultsArr)
    return (
        <Grid container spacing={10} className='result-grid' style={{display:'inline-block', padding: '0px 10px 0px 10px'}} >
            {resultsArr}
        </Grid>
    )
}

export default ResultsContainer;