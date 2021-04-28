import {CenteredContent, Button} from "@dhis2/ui";
import React from "react";
import AddIcon from "@material-ui/icons/Add";
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../core/states/user";
import Visibility from "../../../shared/Components/Visibility";


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
    const {bottleneck} = useRecoilValue(UserRolesState);
    return (
        <CenteredContent>
            <div style={styles.container}>
                <h2 style={styles.text}>There are no interventions documented for selected organisation unit and
                    period. </h2>
                <Visibility visible={bottleneck?.create}>
                    <Button onClick={onAddIndicatorClick} icon={<AddIcon/>} primary>Add Intervention</Button>
                </Visibility>
            </div>
        </CenteredContent>
    )
}
