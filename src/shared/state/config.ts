import { selector, selectorFamily } from 'recoil'
import { type Config } from '../schemas/config'
import { DataEngineState } from './engine'
import { DATASTORE_NAMESPACE } from '../constants/meta'
import { type Program } from '@hisptz/dhis2-utils'
import { head } from 'lodash'

const query: any = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`,
        id: ({ id }: { id: string }) => id
    }
}

const configKeysQuery: any = {
    config: {
        resource: `dataStore/${DATASTORE_NAMESPACE}`
    }
}

const keysToExclude = ['settings', 'savedObjects', 'logs']

export const ConfigIdsState = selector({
    key: 'config-ids',
    get: async ({ get }) => {
        const engine = get(DataEngineState)
        const { config } = await engine.query(configKeysQuery)
        return (config as string[])?.filter(key => !keysToExclude.includes(key))
    }
})

export const ConfigState = selectorFamily<Config | null, string | undefined>({
    key: 'config-state',
    get: (id?: string) => async ({ get }) => {
        if (!id) {
            return null
        }
        const engine = get(DataEngineState)
        try {
            const { config } = await engine.query(query, { variables: { id } })
            return config
        } catch (e) {
            return null
        }
    }
})

const metadataQuery: any = {
    metadata: {
        resource: 'programs',
        params: ({ ids }: { ids: string [] }) => (
            {
                filter: [
                    `id:in:[${ids.join(',')}]`
                ],
                fields: [
                    'id',
                    'displayName',
                    'trackedEntityType',
                    'programTrackedEntityAttributes[mandatory,trackedEntityAttribute[id,displayName,valueType,shortName,formName,optionSet[id,options[code,name]]]]',
                    'programStages[id,displayName,program[id],programStageDataElements[mandatory,dataElement[id,displayName,shortName,valueType,formName,optionSet[id,options[code,name]]]]]'
                ]
            }
        )
    },
    status: {
        resource: 'optionSets',
        id: ({ statusOptionSetId }: { statusOptionSetId: string }) => statusOptionSetId,
        params: {
            fields: [
                'id',
                'name',
                'options[code,name,style[color,icon]]'
            ]
        }
    }
}
export const MetadataState = selectorFamily<{ programs: Program[] } | null, string | undefined>({
    key: 'metadata-state',
    get: (id?: string) => async ({ get }) => {
        if (!id) {
            return null
        }
        const engine = get(DataEngineState)
        const config = get(ConfigState(id))

        if (!config) {
            return null
        }
        const categoryProgram = head(config?.categories)?.id
        const actionProgram = config?.action.id

        const programs = [
            categoryProgram,
            actionProgram
        ]

        try {
            const { metadata } = await engine.query(metadataQuery, {
                variables: {
                    ids: programs,
                    statusOptionSetId: config.action.statusConfig.stateConfig.optionSetId
                }
            })
            return metadata
        } catch (e) {
            return null
        }
    }
})
