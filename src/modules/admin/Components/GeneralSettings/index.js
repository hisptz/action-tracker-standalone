import {Container, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Divider} from '@dhis2/ui'
import React from 'react';
import PeriodSettings from "./Components/PeriodSettings";

const styles = {
    container: {
        background: '#ffffff',
        padding: 20,
        width: '100%'
    },
    header: {
        paddingBottom: 20
    }
}

export default function GeneralSettingsPage() {
    return (
        <Container>
            <Grid container>
                <Grid item xs={12} style={styles.header}>
                    <Typography variant='h5'>General Settings</Typography>
                    <Divider/>
                </Grid>
                <div style={styles.container}>
                    <PeriodSettings/>
                </div>
            </Grid>
        </Container>
    )
}
