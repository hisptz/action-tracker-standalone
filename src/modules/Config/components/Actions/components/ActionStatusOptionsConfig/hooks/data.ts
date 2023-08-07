import { useConfiguration } from '../../../../../../../shared/hooks/config'
import { useDataQuery } from '@dhis2/app-runtime'
import { OptionSet } from '../../../../../../../shared/types/dhis2'

const query: any = {
    statusOptions: {
        resource: 'optionSets',
        id: ({ id }: { id: string }) => id,
        params: {
            fields: [
                'id',
                'displayName',
                'valueType',
                'options[id,code,name,style[color,icon],sortOrder,optionSet[id]]'
            ]
        }
    }
}

export function useStatusOptions () {
    const { config } = useConfiguration()
    const optionSet = config?.action.statusConfig.stateConfig.optionSetId
    const {
        data,
        loading,
        refetch,
        error
    } = useDataQuery<{ statusOptions: OptionSet }>(query, {
        variables: {
            id: optionSet
        },
        lazy: !optionSet
    })

    const options = data?.statusOptions.options

    return {
        options,
        optionSet: data?.statusOptions,
        refetch,
        loading,
        error
    }
}
