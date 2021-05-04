import {Container, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Divider} from '@dhis2/ui'
import React from 'react';
import PeriodSettings from "./Components/PeriodSettings";
import OrgUnitSettings from "./Components/OrgUnitSettings";

const styles = {
    container: {
        padding: '16px 0'
    },
    header: {
        paddingBottom: 16
    },
    content: {
        background: '#ffffff',
        padding: 16,
        width: '100%'
    }
}

export default function GeneralSettingsPage() {
    return (
        <Container style={styles.container} maxWidth={false}>
            <Grid container>
                <Grid item xs={12} style={styles.header}>
                    <Typography variant='h5'>General Settings</Typography>
                    <Divider/>
                </Grid>
                <div style={styles.content}>
                    <Grid container spacing={2} direction='column'>
                        <Grid item>
                            <PeriodSettings/>
                        </Grid>
                        <Grid item>
                            <OrgUnitSettings/>
                        </Grid>
                    </Grid>
                </div>
            </Grid>
        </Container>
    )
}
