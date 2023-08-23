import { useDataQuery } from '@dhis2/app-runtime'
import { useMemo } from 'react'
import { compact, isEmpty } from 'lodash'

const dataElementQuery = {
    items: {
        resource: 'dataElements',
        params: ({ excludeFieldTypes }: any) => ({
            pageSize: 200,
            fields: [
                'id',
                'shorName',
                'formName',
                'displayName',
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
            pageSize: 200,
            fields: [
                'id',
                'shorName',
                'displayName',
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
            dataElements: { id: string; shortName: string; formName: string; valueType: string; displayName: string }[],
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
            trackedEntityAttributes: {
                id: string;
                shortName: string;
                formName: string;
                valueType: string;
                displayName: string;
            }[],
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
                                shortName,
                                displayName,
                                id
                            }) => ({
            label: formName || shortName || displayName,
            value: id
        }))
    }, [values]);

    console.log({ options })
    return {
        values,
        options,
        loading: attrLoading || dELoading,
        error: attrError ?? dEError
    }
}
