import { Container, Fab, Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@dhis2/ui';
import React, {useState} from 'react';
import AddIcon from '@material-ui/icons/Add';
import ChallengeMethodsTable from './Components/ChallengeMethodsTable';
import ChallengeSettingsFormDialog from '../../Dialogs/ChallengeSettingsFormDialog'

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
  const onClose = () => {
    setOpenChallengeSettingsDialog(false);
  };
  const onUpdate = () => {
    setOpenChallengeSettingsDialog(false);
  };
  const [
    openChallengeSettingsDialog,
    setOpenChallengeSettingsDialog,
  ] = useState(false);

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
          <Grid item container justify="flex-end">
            <Fab
              className="primary.jsx-2371629422"
              style={styles.floatingAction}
              color="primary"
              aria-label="add"
              onClick={() =>
                setOpenChallengeSettingsDialog(
                  !openChallengeSettingsDialog
                )
              }
            >
              <AddIcon />
            </Fab>
          </Grid>
          {openChallengeSettingsDialog && (
            <ChallengeSettingsFormDialog
              onClose={onClose}
              onUpdate={onUpdate}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
