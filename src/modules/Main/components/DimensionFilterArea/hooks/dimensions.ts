import {useSearchParams} from "react-router-dom";
import {useCallback, useEffect, useMemo} from "react";
import {OrganisationUnit, PeriodUtility} from "@hisptz/dhis2-utils";
import {useDataQuery} from "@dhis2/app-runtime";


const orgUnitQuery = {
    ou: {
        resource: `organisationUnits`,
        id: ({id}: any) => id,
        params: {
            fields: ['id', 'displayName', 'path', 'level']
        }
    }
}

export function useDimensions() {
    const [params, setParams] = useSearchParams();
    const {loading, data, refetch} = useDataQuery<{ ou: OrganisationUnit }>(orgUnitQuery, {
        variables: {
            id: params.get('ou')
        },
        lazy: true
    })

    const period = useMemo(() => {
        if (!params.get('pe')) return undefined;
        return PeriodUtility.getPeriodById(params.get('pe') as string)
    }, [params.get('pe')]);

    const orgUnit = useMemo(() => {
        if (!data?.ou) return undefined;
        return data?.ou;
    }, [data]);

    const setParam = useCallback((key: string) => (value: string) => {
        const updatedParams = new URLSearchParams(params);
        updatedParams.set(key, value);
        setParams(updatedParams);
    }, [setParams, params]);

    const setPeriod = useCallback(setParam('pe'), [setParam]);
    const setOrgUnit = useCallback(setParam('ou'), [setParam]);

    useEffect(() => {
        if (params.get('ou')) {
            refetch({
                id: params.get('ou')
            })
        }
    }, [params.get('ou')])

    return {
        period,
        orgUnit,
        setPeriod,
        setOrgUnit,
        loading
    }

}
