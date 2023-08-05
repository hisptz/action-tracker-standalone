import { useCallback } from 'react'
import { DATASTORE_NAMESPACE } from '../../../../../shared/constants/meta'
import { Config } from '../../../../../shared/schemas/config'
import { useUpdateMetadata } from '../../../../../shared/hooks/metadata'
import { useDataEngine } from '@dhis2/app-runtime'
import { useMutation } from '@tanstack/react-query'
import { generateDefaultStatusOptionSetMetadata } from '../../../../../shared/constants/initial'

const generateConfigCreateMutation = (id: string): any => {
    return {
        resource: `dataStore/${DATASTORE_NAMESPACE}/${id}`,
        type: 'create',
        data: ({ data }: { data: Config }) => data
    }
}

export function useSaveConfigFromTemplate () {
    const engine = useDataEngine()
    const {
        createMetadataFromConfig
    } = useUpdateMetadata()

    const save = useCallback(async (config: Config) => {
        const extraMetadata = generateDefaultStatusOptionSetMetadata(config.action.statusConfig.stateConfig.optionSetId, config.code)
        await createMetadataFromConfig(config, extraMetadata)
        await engine.mutate(generateConfigCreateMutation(config.id), {
            variables: {
                data: config
            }
        })
    }, [])

    const {
        mutateAsync: saveConfig,
        isLoading,
        error
    } = useMutation<any, any, Config>(['save-config'], save)

    return {
        save: saveConfig,
        saving: isLoading,
        error
    }
}
