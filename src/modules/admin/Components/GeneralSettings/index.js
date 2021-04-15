import {Container, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Divider} from '@dhis2/ui'
import React from 'react';
import PlanningPeriodEditor from "./Components/PlanningPeriodEditor";
import TrackingPeriodEditor from "./Components/TrackingPeriodEditor";

const styles = {
    container: {
        background: '#ffffff',
        padding: 20
    },
    header:{
        paddingBottom: 20
    }
}

export default function GeneralSettingsPage() {
    return (
        <Container >
            <Grid container>
                <Grid item xs={12} style={styles.header}>
                    <Typography variant='h5'>General Settings</Typography>
                    <Divider/>
                </Grid>
                <Grid item spacing={3} container direction='column' style={styles.container}>
                    <Grid item>
                        <PlanningPeriodEditor/>
                    </Grid>
                    <Grid item>
                        <TrackingPeriodEditor/>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}
