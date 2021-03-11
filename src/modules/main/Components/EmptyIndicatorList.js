import {CenteredContent, Button} from "@dhis2/ui";
import React from "react";


export default function EmptyIndicatorList() {

    return (

        <CenteredContent>
            <div style={{textAlign: 'center'}}>
                <h2 style={{color: '#6E7A8A'}}>There are no indicators configured for this organisation unit and
                    period. </h2>
                <Button primary>Add Indicator</Button>
            </div>
        </CenteredContent>

    )
}
