import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { PeriodUtility } from '@hisptz/dhis2-utils'

export function useDimensions () {
    const [params, setParams] = useSearchParams()

    const period = useMemo(() => {
        if (params.get('pe') == null) return undefined
        return PeriodUtility.getPeriodById(params.get('pe') as string)
    }, [params.get('pe')])

    const setParam = useCallback((key: string) => (value: string) => {
        setParams((prev) => {
            const updatedParams = new URLSearchParams(prev)
            updatedParams.set(key, value)
            return updatedParams
        })
    }, [setParams])

    const setPeriod = useCallback(setParam('pe'), [setParam])
    const setOrgUnit = useCallback(setParam('ou'), [setParam])

    return {
        period,
        orgUnit: {id: params.get("ou")},
        setPeriod,
        setOrgUnit
    }
}

export function usePageType () {
    const [searchParams] = useSearchParams()
    return useMemo(() => searchParams.get('type'), [searchParams])
}
