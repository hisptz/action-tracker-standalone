import { Container, Fab, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@dhis2/ui';
import {useState} from 'react';
import ActionStatusTable from './Components/ActionStatusOptionsTable';
import AddIcon from '@material-ui/icons/Add';
import ActionStatusSettingsFormDialog from '../Dialogs/ActionStatusSettingsFormDialog';

const styles = {
  container: {
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
    <Container>
      <Grid container>
        <Grid item xs={12} style={styles.header}>
          <Typography variant="h5">Action Status Settings</Typography>
          <Divider />
        </Grid>
        <Grid
          item
          spacing={3}
          container
          direction="column"
          justify="space-between"
          style={styles.container}
        >
          <Grid item style={styles.tableContainer}>
            <ActionStatusTable />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
