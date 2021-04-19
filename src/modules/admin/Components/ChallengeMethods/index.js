import { Container, Fab, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@dhis2/ui';
import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import ChallengeMethodsTable from './Components/ChallengeMethodsTable';
import ChallengeSettingsFormDialog from '../Dialogs/ChallengeSettingsFormDialog'

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
  floatingAction: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    background: '#2b61b3',
  },
};

export default function ChallengeMethodsSettings() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12} style={styles.header}>
          <Typography variant="h5">Challenge Settings</Typography>
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
            <ChallengeMethodsTable />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
