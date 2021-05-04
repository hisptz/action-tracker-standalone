import { Container, Fab, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@dhis2/ui';
import React from 'react';
import ChallengeMethodsTable from './Components/ChallengeMethodsTable';

const styles = {
  container: {
    padding: '16px 0'
  },
  tableContainer: {
    background: '#ffffff',
    padding: 16,
  },
  content:{
    height: '100%',
  },
  header: {
    paddingBottom: 16,
  },
  floatingAction: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    background: '#2b61b3',
  },
};

export default function ChallengeMethodsSettings() {
  return (
    <Container maxWidth={false} style={styles.container}>
      <Grid container>
        <Grid item xs={12} style={styles.header}>
          <Typography variant="h5">Challenge Settings</Typography>
          <Divider />
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
            <ChallengeMethodsTable />
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
