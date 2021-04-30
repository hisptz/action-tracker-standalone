import {Container, Fab, Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {Divider} from '@dhis2/ui';
import ActionStatusTable from './Components/ActionStatusOptionsTable';

const styles = {
    container: {
        padding: '16px 0'
    },
    content: {
        height: '100%',
    },
    tableContainer: {
        background: '#ffffff',
        padding: 20,
    },
    header: {
        paddingBottom: 20,
    },
};

export default function ActionStatusLegendSettingsPage() {

    return (
        <Container maxWidth={false} style={styles.container}>
            <Grid container>
                <Grid item xs={12} style={styles.header}>
                    <Typography variant="h5">Action Status Settings</Typography>
                    <Divider/>
                </Grid>
                <Grid
                    item
                    spacing={0}
                    container
                    direction="column"
                    justify="space-between"
                    style={styles.content}
                >
                    <Grid item style={styles.tableContainer}>
                        <ActionStatusTable/>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
