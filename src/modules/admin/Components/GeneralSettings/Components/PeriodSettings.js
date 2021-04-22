import useSetting from "../hooks/setting";
import DataStoreConstants from "../../../../../core/constants/datastore";
import {useAlert} from "@dhis2/app-runtime";
import Grid from "@material-ui/core/Grid";
import React, {useEffect, useState} from "react";
import CustomPeriodEditor from "./CustomPeriodEditor";
import {PeriodType} from "@iapps/period-utilities";
import _ from "lodash";

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
            show({message: e?.message || e?.toString(), type: {success: true}})
        },
        onSaveComplete: () => {
            show({message: 'Planning period changed successfully', type: {success: true}})
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
            show({message: 'Tracking period changed successfully', type: {success: true}})
        }
    });

    useEffect(() => {
        if (_.find(getPeriodsToExclude(planningSetting), (period) => period.name === trackingSetting)) {
            clearTrackingPeriod().then(_ => setPeriodsToExclude(getPeriodsToExclude(planningSetting)))
        } else {
            setPeriodsToExclude(getPeriodsToExclude(planningSetting));
        }
    }, [planningSetting]);

    return (
        <Grid item spacing={3} container direction='column'>
            <Grid item>
                <CustomPeriodEditor error={planningError} saving={planningSaving} value={planningSetting}
                                    onChange={({selected}) => planningSet(selected)} label='Planning Period'/>
            </Grid>
            <Grid item>
                <CustomPeriodEditor error={trackingError} saving={trackingSaving} value={trackingSetting}
                                    exclude={!trackingSaving && periodsToExclude}
                                    onChange={({selected}) => trackingSet(selected)} label='Tracking Period'/>
            </Grid>
        </Grid>
    )

}
