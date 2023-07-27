import { useDataQuery } from '@dhis2/app-runtime'
import { type OrganisationUnit } from '@hisptz/dhis2-utils'
import { useUpdateEffect } from 'usehooks-ts'

const orgUnitQuery = {
    ou: {
        resource: `organisationUnits`,
        id: ({ id }: any) => id,
        params: {
            fields: ['id', 'displayName', 'path', 'level']
        }
    }
}

export function useOrgUnit (initialId?: string | null) {
    const {
        refetch,
        data,
        loading
    } = useDataQuery<{ ou: OrganisationUnit }>(orgUnitQuery, {
        variables: {
            id: initialId
        },
        lazy: !initialId
    })

    useUpdateEffect(() => {
        if (initialId) {
            refetch({ id: initialId }).catch(console.error)
        }
    }, [refetch, initialId])

    return {
        loading,
        orgUnit: data?.ou,
        refetch
    }
}
