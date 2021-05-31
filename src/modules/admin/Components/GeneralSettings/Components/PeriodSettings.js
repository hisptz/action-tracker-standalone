import useSetting from "../hooks/setting";
import DataStoreConstants from "../../../../../core/constants/datastore";
import {useAlert} from "@dhis2/app-runtime";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import CustomPeriodEditor from "./CustomPeriodEditor";
import {PeriodType} from "@iapps/period-utilities";
import _ from "lodash";
import Visibility from "../../../../../shared/Components/Visibility";
import {useRecoilValue} from "recoil";
import {UserRolesState} from "../../../../../core/states/user";
import i18n from '@dhis2/d2-i18n'

function getPeriodsToExclude(planningPeriod) {
    const periodTypes = new PeriodType().get();
    const planningPeriodObject = _.find(periodTypes, ['name', planningPeriod]);
    if (planningPeriodObject) {
        return _.filter(periodTypes, ({rank}) => rank > planningPeriodObject.rank);
    } else {
        return []
    }
}

export default function PeriodSettings() {
    const [periodsToExclude, setPeriodsToExclude] = useState([]);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    const {
        setting: planningSetting,
        saving: planningSaving,
        setSetting: planningSet,
        error: planningError
    } = useSetting(DataStoreConstants.PLANNING_PERIOD_KEY, {
        onError: (e) => {
            show({message: i18n.t('{{ message }}', {message: e?.message || e.toString()}) , type: {success: true}})
        },
        onSaveComplete: () => {
            show({message:  i18n.t('Planning period changed successfully'), type: {success: true}})
        }
    });

    const {
        setting: trackingSetting,
        saving: trackingSaving,
        setSetting: trackingSet,
        error: trackingError,
        clearValue: clearTrackingPeriod
    } = useSetting(DataStoreConstants.TRACKING_PERIOD_KEY, {
        onError: (e) => {
            show({message: e?.message || e?.toString(), type: {success: true}})
        },
        onSaveComplete: () => {
            show({message: i18n.t('Tracking period changed successfully'), type: {success: true}})
        }
    });

    useEffect(() => {
        if (_.find(getPeriodsToExclude(planningSetting), (period) => period.name === trackingSetting)) {
            clearTrackingPeriod().then(_ => setPeriodsToExclude(getPeriodsToExclude(planningSetting)))
        } else {
            setPeriodsToExclude(getPeriodsToExclude(planningSetting));
        }
    }, [planningSetting]);
    const {settings} = useRecoilValue(UserRolesState);

    return (
        <Grid item spacing={3} container direction='column'>
            <Grid item>
               <Visibility visible={settings.planningPeriod}>
                   <CustomPeriodEditor error={planningError} saving={planningSaving} value={planningSetting}
                                       onChange={({selected}) => planningSet(selected)} label={i18n.t('Planning Period')}/>
               </Visibility>
            </Grid>
            <Grid item>
                <Visibility visible={settings.trackingPeriod}>
                    <CustomPeriodEditor error={trackingError} saving={trackingSaving} value={trackingSetting}
                                        exclude={!trackingSaving && periodsToExclude}
                                        onChange={({selected}) => trackingSet(selected)} label={i18n.t('Tracking Period')}/>
                </Visibility>
            </Grid>
        </Grid>
    )

}
