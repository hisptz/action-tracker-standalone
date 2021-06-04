import {useAlert} from "@dhis2/app-runtime";
import useSATSetting from "../hooks/setting";
import DataStoreConstants from "../../../../../core/constants/datastore";
import CustomOrgUnitSelector from "./CustomOrgUnitSelector";

import React from 'react';
import Visibility from "../../../../../shared/Components/Visibility";
import {UserRolesState} from "../../../../../core/states/user";
import {useRecoilValue} from "recoil";
import i18n from '@dhis2/d2-i18n'
import classes from '../../../admin.module.css'

export default function OrgUnitSettings() {
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}));
    const {
        setting: planningOrgUnit,
        saving,
        setSetting: setPlanningOrgUnit,
        error: savingError
    } = useSATSetting(DataStoreConstants.PLANNING_ORG_UNIT_KEY, {
        onError: (e) => {
            show({
                message: i18n.t('{{ message }}', {message: e?.message || e.toString()}) || e?.toString(),
                type: {critical: true}
            })
        },
        onSaveComplete: () => {
            show({message: i18n.t('Planning organisation unit changed successfully'), type: {success: true}})
        }
    });

    const {settings} = useRecoilValue(UserRolesState);

    return (<Visibility visible={settings.planningOrgUnitLevel}>
            <div className={classes['selector']}>
                <CustomOrgUnitSelector onChange={({selected}) => setPlanningOrgUnit(selected)}
                                       label={i18n.t('Planning Organisation Unit')} value={planningOrgUnit}
                                       saving={saving}
                                       savingError={savingError}/>
            </div>
        </Visibility>
    )


}
