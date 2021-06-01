import {CenteredContent} from "@dhis2/ui";
import React from "react";
import ErrorIcon from '@material-ui/icons/Error';

export default function FullPageError({error}){

    return(
        <CenteredContent>
            <div style={{textAlign:'center'}}>
                <ErrorIcon fontSize='large' style={{color: '#6E7A8A' }} />
                <h4 style={{color: '#6E7A8A'}}>{error.message || error.details || error.toString()}</h4>
            </div>
        </CenteredContent>
    )
}
