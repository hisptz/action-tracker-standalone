import ActionStatusTable from './Components/ActionStatusOptionsTable';
import i18n from '@dhis2/d2-i18n'
import classes from '../../admin.module.css'
import React from 'react'

export default function ActionStatusLegendSettingsPage() {

    return (
        <div className={classes.column}>
            <div className={classes.header}>
                <h2>{i18n.t('Action Status Settings')}</h2>
            </div>
            <div className={classes['table-container']}>
                <ActionStatusTable/>
            </div>
        </div>
    );
}
