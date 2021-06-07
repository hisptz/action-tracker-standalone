import {Divider} from '@dhis2/ui'
import React from 'react';
import PeriodSettings from "./Components/PeriodSettings";
import OrgUnitSettings from "./Components/OrgUnitSettings";
import i18n from '@dhis2/d2-i18n'
import classes from '../../admin.module.css'

export default function GeneralSettingsPage() {
    return (
        <div className={classes['general-settings-container']}>
                <div className={classes['header']}>
                    <h2>{i18n.t('General Settings')}</h2>
                    <Divider/>
                </div>
                <div className={classes['settings-content']}>
                        <div className={classes['general-setting']}>
                            <PeriodSettings/>
                        </div>
                        <div className={classes['general-setting']} >
                            <OrgUnitSettings/>
                        </div>
                </div>
        </div>
    )
}
