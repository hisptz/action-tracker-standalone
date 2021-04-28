import {useAlert} from "@dhis2/app-runtime";
import useSetting from "../hooks/setting";
import DataStoreConstants from "../../../../../core/constants/datastore";
import CustomOrgUnitSelector from "./CustomOrgUnitSelector";

import React from 'react';
import Grid from "@material-ui/core/Grid";
import Visibility from "../../../../../shared/Components/Visibility";
import {UserRolesState} from "../../../../../core/states/user";
import {useRecoilValue} from "recoil";

export default function OrgUnitSettings() {
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}));
    const {
        setting: planningOrgUnit,
        saving,
        setSetting: setPlanningOrgUnit,
        error: savingError
    } = useSetting(DataStoreConstants.PLANNING_ORG_UNIT_KEY, {
        onError: (e) => {
            show({message: e?.message || e?.toString(), type: {success: true}})
        },
        onSaveComplete: () => {
            show({message: 'Planning organisation unit changed successfully', type: {success: true}})
        }
    });

    const {settings} = useRecoilValue(UserRolesState);

    return (<Visibility visible={settings.planningOrgUnitLevel}>
            <Grid item container spacing={3} direction='column'>
                <Grid item>
                    <CustomOrgUnitSelector onChange={({selected}) => setPlanningOrgUnit(selected)}
                                           label='Planning Organisation Unit' value={planningOrgUnit} saving={saving}
                                           savingError={savingError}/>
                </Grid>
            </Grid>
        </Visibility>
    )


}
