import {CenteredContent, Button} from "@dhis2/ui";
import React from "react";
import AddIcon from "@material-ui/icons/Add";


const styles = {
    container: {
        textAlign: 'center',
        height: '100%'
    },
    text: {
        color: '#6E7A8A'
    }
}

export default function EmptyChallengeList({onAddIndicatorClick}) {

    return (
        <CenteredContent>
            <div style={styles.container}>
                <h2 style={styles.text}>There are no interventions documented for selected organisation unit and
                    period. </h2>
                <Button onClick={onAddIndicatorClick} icon={<AddIcon/>} primary>Add Intervention</Button>
            </div>
        </CenteredContent>
    )
}
