import {Container, Fab, Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {Divider} from '@dhis2/ui';
import ActionStatusTable from './Components/ActionStatusOptionsTable';
import i18n from '@dhis2/d2-i18n'

const styles = {
    container: {
        padding: '16px 0'
    },
    content: {
        height: '100%',
    },
    tableContainer: {
        background: '#ffffff',
        padding: 16,
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
                    <Typography variant="h5">{i18n.t('Action Status Settings')}.</Typography>
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
