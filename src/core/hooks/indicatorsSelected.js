import {useSetRecoilState, useRecoilValue} from "recoil";
import {DimensionsState} from "../states";

import {IndicatorsSelectedState} from "../states";
import {useDataMutation, useDataQuery} from "@dhis2/app-runtime";
import {useEffect} from "react";
import {INDICATOR_ATTRIBUTE, BOTTLENECK_PROGRAM_ID} from "../constants";
import { listOfSelectedIndicatorsFromResponse} from '../helpers/dataManipulationHelper'




const indicatorsSelectedQuery = {
    data: {
        id: 'query',
        resource: 'trackedEntityInstances',
        params: ({ou}) => ({
            ou,
            program: BOTTLENECK_PROGRAM_ID,
            attribute: INDICATOR_ATTRIBUTE
        })
    }
}



export default function useIndicatorsSelected() {
    const {orgUnit, period} = useRecoilValue(DimensionsState);
    const setIndicatorsSelected = useSetRecoilState(IndicatorsSelectedState);
    const {loading, data, error, refetch} = useDataQuery(indicatorsSelectedQuery, {
        variables: {
            ou: orgUnit?.id
        }
    });
   

    useEffect(() => {
        async function setIndicatorsSelectedData() {
            if (!loading && data && !error) {
                const responseData = data.data? data.data : {};
                const formattedData = listOfSelectedIndicatorsFromResponse(responseData);
                setIndicatorsSelected(formattedData);
            }
        }

        setIndicatorsSelectedData();
    }, [loading])

    return {loading };
}
