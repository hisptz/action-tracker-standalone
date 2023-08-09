import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { compact, isEmpty } from 'lodash'

const dataElementQuery = {
    items: {
        resource: 'dataElements',
        params: ({ excludeFieldTypes }: any) => ({
            fields: [
                'id',
                'shorName',
                'formName',
                'valueType'
            ],
            filter: compact([
                'domainType:eq:TRACKER',
                !isEmpty(excludeFieldTypes) ? `valueType:!in:[${excludeFieldTypes.join(',')}]` : undefined
            ])
        })
    }
}

const attributesQuery = {
    items: {
        resource: 'trackedEntityAttributes',
        params: ({ excludeFieldTypes }: any) => ({
            fields: [
                'id',
                'shorName',
                'formName',
                'valueType'
            ],
            filter: compact([
                !isEmpty(excludeFieldTypes) ? `valueType:!in:[${excludeFieldTypes.join(',')}]` : undefined
            ])
        })
    }
}

export function useDataItems (type: 'dataElement' | 'attribute', {
    filtered,
    excludeFieldTypes
}: {
    filtered: string[],
    excludeFieldTypes?: string[]
}) {
    const {
        data: dEData,
        loading: dELoading,
        error: dEError
    } = useDataQuery<{
        items: {
            dataElements: { id: string; shortName: string; formName: string; valueType: string; }[],
        }
    }>(dataElementQuery, {
        lazy: type !== 'dataElement',
        variables: {
            excludeFieldTypes
        }
    })
    const {
        data: attrData,
        loading: attrLoading,
        error: attrError
    } = useDataQuery<{
        items: {
            trackedEntityAttributes: { id: string; shortName: string; formName: string; valueType: string; }[],
        }
    }>(attributesQuery, {
        lazy: type !== 'attribute',
        variables: {
            excludeFieldTypes
        }
    })
    const values = useMemo(() => {
        if (type === 'dataElement') {
            return dEData?.items?.dataElements?.filter(({ id }) => !filtered.includes(id)) ?? []
        } else {
            return attrData?.items?.trackedEntityAttributes?.filter(({ id }) => !filtered.includes(id)) ?? []
        }
    }, [attrData, dEData])

    const options = useMemo(() => {
        return values?.map(({
                                formName,
                                id
                            }) => ({
            label: formName,
            value: id
        }))
    }, [values])
    return {
        values,
        options,
        loading: attrLoading || dELoading,
        error: attrError ?? dEError
    }
}
