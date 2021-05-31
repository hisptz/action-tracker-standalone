import {useSetRecoilState, useRecoilValue} from 'recoil';
import {DimensionsState} from '../states';
import {useDataQuery} from '@dhis2/app-runtime';
import {useEffect} from 'react';
import {IndicatorProgressState} from '../states';
import {map, flattenDeep} from 'lodash';
import {formatAnalytics} from '../helpers/analyticsManipulation.helper';
import {useDataStore} from "@dhis2/app-service-datastore";
import DataStoreConstants from "../constants/datastore";


function joinPeriodsArray(periods, trackingPeriod) {
    let isoPeriods = [];
    for (const period of periods) {
        const trackingPeriods = period[trackingPeriod.toLowerCase()]
        const isoQuarterlyPeriods = flattenDeep(
            map(trackingPeriods || [], (quarter) => {
                return quarter && quarter.id ? quarter.id : [];
            })
        );
        isoPeriods.push(...isoQuarterlyPeriods)
    }
    console.log(isoPeriods.join(';'));
    return isoPeriods.length ? isoPeriods.join(';') : '';
}

const indicatorProgressQuery = {
    data: {
        resource: 'analytics',
        params: ({indicatorId, periods, ou, trackingPeriod}) => ({
            dimension: [
                `dx:${indicatorId}`,
                `pe:${joinPeriodsArray(
                    periods, trackingPeriod
                )}`,
            ],
            filter: [
                `ou:${ou}`
            ],
            displayProperty: 'NAME',
            skipMeta: false,
            includeNumDen: true
        })
    }
}


export default function useIndicatorProgress({indicatorId}) {

    const {orgUnit, period} = useRecoilValue(DimensionsState) || {};
    const {globalSettings} = useDataStore();
    const trackingPeriod = globalSettings.settings[DataStoreConstants.TRACKING_PERIOD_KEY];
    const setIndicatorProgress = useSetRecoilState(IndicatorProgressState);

    const {loading, data, error} = useDataQuery(
        indicatorProgressQuery,
        {
            variables: {
                ou: orgUnit?.id,
                periods: [period],
                indicatorId,
                trackingPeriod
            },
        }
    );


    useEffect(() => {
        async function setIndicatorsSelectedData() {
            if (!loading && data && !error) {
                const responseData = data.data ? data.data : {};
                const formattedData = formatAnalytics(responseData);
                setIndicatorProgress(formattedData);
            }
        }

        setIndicatorsSelectedData();
    }, [loading]);

    return {loading, error};
}
