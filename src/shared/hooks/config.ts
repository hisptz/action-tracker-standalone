import { useParams } from 'react-router-dom'
import { DATASTORE_NAMESPACE } from '../constants/meta'
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil'
import { ConfigIdsState, ConfigState } from '../state/config'

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

export function useConfigurations () {
    const configs = useRecoilValue(ConfigIdsState)
    return {
        configs
    }
}
