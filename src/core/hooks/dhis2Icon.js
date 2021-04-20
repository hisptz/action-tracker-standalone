import { useEffect} from 'react';
import {useDataQuery} from "@dhis2/app-runtime";
import { useSetRecoilState, useRecoilValue, useRecoilState } from 'recoil';
import { Dhis2IconState} from '../states'

const iconQuery = {
    data: {
        resource: 'icons',
        params: ({}) => ({
            totalCount: true
        })
    }
}

export function useDhis2Icons() {
    const {loading, data, error} = useDataQuery(iconQuery, {variables: {}});
    const setDhis2Icons = useSetRecoilState(Dhis2IconState)

    useEffect(() => {
        async function setIndicatorsSelectedData() {
          if (!loading && data && !error) {
            const dhis2Icons = data.data ? data.data : [];
            setDhis2Icons(dhis2Icons);
          }
        }
    
        setIndicatorsSelectedData();
      }, [loading]);
    return {loading, error}
}



