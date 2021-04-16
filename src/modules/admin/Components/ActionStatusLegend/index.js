import {Container, Fab, Typography} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {Divider} from "@dhis2/ui";
import React from "react";
import ActionStatusTable from "./Components/ActionStatusOptionsTable";
import AddIcon from '@material-ui/icons/Add';

const styles = {
    container: {
        height: '100%'
    },
    tableContainer: {
        background: '#ffffff',
        padding: 20
    },
    header: {
        paddingBottom: 20
    },
    floatingAction: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        background: '#2b61b3'
    }
}

export default function ActionStatusLegendSettingsPage() {

    return (
        <Container>
            <Grid container>
                <Grid item xs={12} style={styles.header}>
                    <Typography variant='h5'>Action Status Settings</Typography>
                    <Divider/>
                </Grid>
                <Grid item spacing={3} container direction='column' justify='space-between' style={styles.container}>
                    <Grid item style={styles.tableContainer}>
                        <ActionStatusTable/>
                    </Grid>
                    <Grid item container justify='flex-end'>
                        <Fab className='primary.jsx-2371629422' style={styles.floatingAction} color="primary"
                             aria-label="add">
                            <AddIcon/>
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    )
}
