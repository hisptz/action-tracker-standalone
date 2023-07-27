import { useDataQuery } from '@dhis2/app-runtime'
import { useUpdateEffect } from 'usehooks-ts'

const optionSetQuery = {
    sets: {
        resource: "optionSets",
        params: ({valueType}: { valueType: string }) => {
            return {
                fields: ["id", "name", "options", "valueType"],
                filter: valueType ? `valueType:eq:${valueType}` : undefined
            }
        }
    }
}

export function useOptionSets(valueType: string) {
    const {data, loading, refetch} = useDataQuery<{
        sets: { optionSets: Array<{ id: string, name: string, options: Array<{ id: string, name: string }> }> }
    }>(optionSetQuery as any, {
        variables: {
            valueType
        }
    });

    useUpdateEffect(() => {
        if (valueType) {
            refetch({
                valueType
            })
        }
    }, [valueType])

    return {
        optionSets: data?.sets.optionSets,
        refetch,
        loading
    }
}
