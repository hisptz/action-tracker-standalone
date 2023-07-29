import { atom } from 'recoil'
import { useDataEngine } from '@dhis2/app-runtime'

export const DataEngineState = atom<ReturnType<typeof useDataEngine>>({
    key: 'data-engine-state'
})
