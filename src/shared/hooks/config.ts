import { useParams } from 'react-router-dom'
import { useDataQuery } from '@dhis2/app-runtime'
import { DATASTORE_NAMESPACE } from '../constants/meta'
import { useMemo } from 'react'
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil'
import { ConfigState } from '../state/config'

export function useConfiguration () {
    const { id } = useParams<{ id: string }>()
    const config = useRecoilValue(ConfigState(id))
    const resetConfig = useRecoilRefresher_UNSTABLE(ConfigState(id))
    return {
        config,
        id,
        reset: resetConfig
    }
}

const configQuery: any = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`
    }
}
const keysToExclude = ['settings', 'savedObjects', 'logs']

export function useConfigurations () {
    const {
        data,
        loading,
        refetch
    } = useDataQuery<{ config: string[] }>(configQuery)
    const configs = useMemo(() => data?.config.filter(key => !keysToExclude.includes(key)), [data?.config])

    return {
        configs,
        loading,
        refetch
    }
}
