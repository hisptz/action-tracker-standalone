import {
    ACTION_PROGRAM_ID,
    BOTTLENECK_PROGRAM_ID,
    generateConfigFromMetadata,
    OLD_DATASTORE_NAMESPACE
} from '../../../shared/utils/config'
import { FetchError, useAlert, useDataQuery } from '@dhis2/app-runtime'
import { useCallback } from 'react'
import { DATASTORE_NAMESPACE } from '../../../shared/constants/meta'
import { Config } from '../../../shared/schemas/config'
import { isEmpty } from 'lodash'
import { useUpdateMetadata } from '../../../shared/hooks/metadata'
import { useMigrateData } from './migrate'
import { Program } from '@hisptz/dhis2-utils'
import { useMutation } from '@tanstack/react-query'

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
                'programTrackedEntityAttributes[trackedEntityAttribute[id,name,shortName,formName,valueType,optionSet[id,name,options[id,name,code]]],mandatory]',
                'programStages[id,name,programStageDataElements[dataElement[id,name,valueType,formName,shortName,optionSet[id,name,options[id,name,code]]]]]',
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
    const {
        migrate,
        progress
    } = useMigrateData()
    const {
        updateMetadataFromConfig
    } = useUpdateMetadata()
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const {
        data,
        loading,
        refetch,
        engine
    } = useDataQuery<{ meta: { programs: Program[], }, settings: any }>(programsQuery)

    const setupConfiguration = useCallback(async () => {
        if (!data) {
            throw Error('Something went wrong. Could not find existing metadata')
        }
        const {
            meta,
            settings
        } = data

        if (isEmpty(meta?.programs)) {
            return
        }
        const generatedConfig = generateConfigFromMetadata({
            programs: meta.programs,
            defaultSettings: settings
        })

        const response = await updateMetadataFromConfig(generatedConfig)

        if ((response as unknown as FetchError)?.message) {
            throw response
        }

        await migrate(generatedConfig)

        return await engine.mutate(generateConfigCreateMutation(generatedConfig.id), {
            variables: {
                data: generatedConfig
            }
        })

    }, [refetch, data])

    const {
        mutateAsync: setup,
        isLoading
    } = useMutation(['metadata'], setupConfiguration, {
        retry: false
    })

    return {
        setupConfiguration: setup,
        settingUpConfiguration: isLoading,
        progress,
        loading,
        programs: data?.meta.programs
    }

}
