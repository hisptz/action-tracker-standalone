import {
    ACTION_PROGRAM_ID,
    BOTTLENECK_PROGRAM_ID,
    generateConfigFromMetadata,
    OLD_DATASTORE_NAMESPACE
} from '../../../shared/utils/config'
import { useAlert, useDataQuery } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { DATASTORE_NAMESPACE } from '../../../shared/constants/meta'
import { Config } from '../../../shared/schemas/config'
import i18n from '@dhis2/d2-i18n'
import { isEmpty } from 'lodash'

const programsQuery = {
    meta: {
        resource: 'programs',
        params: {
            filter: [
                `id:in:[${BOTTLENECK_PROGRAM_ID},${ACTION_PROGRAM_ID}]`
            ],
            fields: [
                'id',
                'name',
                'organisationUnits[id,path]',
                'programTrackedEntityAttributes[trackedEntityAttribute[id,name,valueType,optionSet[id,name,options[id,name,code]]],mandatory]',
                'programStages[id,name,programStageDataElements[dataElement[id,name,valueType,optionSet[id,name,options[id,name,code]]]]]',
            ]
        }
    },
    settings: {
        resource: `dataStore/${OLD_DATASTORE_NAMESPACE}/settings`
    }
}

const generateConfigCreateMutation = (id: string): any => {
    return {
        resource: `dataStore/${DATASTORE_NAMESPACE}/${id}`,
        type: 'create',
        data: ({ data }: { data: Config }) => data
    }
}

export function useSetupMetadata () {
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const {
        refetch,
        engine
    } = useDataQuery(programsQuery)

    const setupConfiguration = useCallback(async () => {
        try {
            const {
                meta,
                settings
            } = (await refetch()) as any ?? {}

            if (isEmpty(meta?.programs)) {
                return
            }
            const generatedConfig = generateConfigFromMetadata({
                programs: meta.programs,
                defaultSettings: settings
            })
            return await engine.mutate(generateConfigCreateMutation(generatedConfig.id), {
                variables: {
                    data: generatedConfig
                }
            })

        } catch (e: any) {
            show({
                message: `${i18n.t('Error setting up configuration')}:  ${e.message || e.toString()}`,
                type: { critical: true }
            })
            console.error(e)
            throw e
        }

    }, [refetch])

    return {
        setupConfiguration
    }

}
