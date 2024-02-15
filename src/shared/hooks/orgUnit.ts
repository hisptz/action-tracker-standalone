import { useDataQuery } from '@dhis2/app-runtime'
import { type OrganisationUnit, OrganisationUnitLevel } from '@hisptz/dhis2-utils'
import { useUpdateEffect } from 'usehooks-ts'
import { useEffect } from 'react'
import { isEmpty } from 'lodash'

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

const orgUnitLevelQuery = {
    level: {
        resource: 'organisationUnitLevels',
        params: ({ ids }: any) => {
            return {
                fields: [
                    'id',
                    'displayName',
                    'level'
                ],
                filter: [
                    `id:in:[${ids.join(',')}]`
                ]
            }
        }
    }
}

export function useOrgUnitLevels (initialIds?: string[] | null) {
    const {
        refetch,
        data,
        loading
    } = useDataQuery<{ level: { organisationUnitLevels: OrganisationUnitLevel[] } }>(orgUnitLevelQuery, {
        variables: {
            id: initialIds
        },
        lazy: true
    })

    useEffect(() => {
        if (!isEmpty(initialIds)) {
            refetch({ ids: initialIds }).catch(console.error)
        }
    }, [refetch, initialIds])

    return {
        loading,
        levels: data?.level?.organisationUnitLevels,
        refetch
    }
}
