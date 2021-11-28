import React from "react";
import { Grid } from "@material-ui/core";

import Result from "./Result";

//Holds search results from iTunes search
const ResultsContainer = ({user, results, setMessage, subscriptions}) => {
    const resultsArr = results.map(result=> 
        <Result 
            user={user} 
            result={result} 
            key={result.collectionId} 
            setMessage={setMessage} 
            subscriptions={subscriptions}
        />
    );

    return (
        <Grid 
            container spacing={2} 
            className='result-grid' 
            style={{
                display:'inline-block', 
                padding: '10px 10px 0px 10px', 
                overflowY:'scroll', 
                height:'800px'
            }} >
            {resultsArr}
        </Grid>
    );
};

export default ResultsContainer;