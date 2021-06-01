import { Divider } from '@dhis2/ui';
import React from 'react';
import ChallengeMethodsTable from './Components/ChallengeMethodsTable';
import i18n from '@dhis2/d2-i18n'
import classes from '../../admin.module.css'


export default function ChallengeMethodsSettings() {
  return (
    <div className={classes.column}>
      <div className={classes.header}>
        <h2>{i18n.t('Challenge Settings')}</h2>
        <Divider />
      </div>
      <div className={classes['table-container']}>
        <ChallengeMethodsTable />
      </div>
    </div>
  );
}
