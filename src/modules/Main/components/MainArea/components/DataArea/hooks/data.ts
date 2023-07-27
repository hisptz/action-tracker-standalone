import { useDimensions } from '../../../../../../../shared/hooks'
import { useConfiguration } from '../../../../../../../shared/hooks/config'
import { useMetadata } from '../../../../../../../shared/hooks/metadata'
import { useCallback, useMemo } from 'react'
import { find, head } from 'lodash'
import { useDataQuery } from '@dhis2/app-runtime'
import { useUpdateEffect } from 'usehooks-ts'

const dataQuery: any = {
    data: {
        resource: "tracker/trackedEntities",
        params: ({program, orgUnit, pageSize, page}: {
            program: string
            orgUnit: string
            trackedEntityType: string
            pageSize: number
            page: number
        }) => {
            return {
                program,
                page,
                pageSize,
                orgUnit,
                fields: [
                    'trackedEntity',
                    'attributes[attribute,value]',
                    'enrollments[*]'
                ]
            }
        }
    }
}

export function useCategoryData() {
    const {orgUnit} = useDimensions();
    const {config} = useConfiguration();
    const {programs} = useMetadata();
    const initialCategory = useMemo(() => {
        if (config != null) {
            return head(config.categories) ?? config.action
        }
    }, [config]);

    const {
        data, refetch, loading
    } =
        useDataQuery<{
        data: { instances: any[], page: number, pageSize: number, total: number }
    }>(dataQuery, {
        variables: {
            program: initialCategory?.id,
            trackedEntityType: find(programs, ['id', initialCategory?.id])?.trackedEntityType?.id,
            orgUnit: orgUnit?.id,
            page: 1,
            pageSize: 5
        }
    });

    const pagination = useMemo(() => {
        if (data != null) {
            return {
                page: data.data.page,
                pageSize: data.data.pageSize,
                total: data.data.total
            }
        } else {
            return {
                page: 0,
                pageSize: 0,
                total: 0
            }
        }
    }, [data])

    const onPageChange = useCallback((page: number) => {
        refetch({
            page
        }).catch(console.error)
    }, [refetch]);

    const onPageSizeChange = useCallback((pageSize: number) => {
        refetch({
            pageSize
        }).catch(console.error)
    }, []);

    const categoryData = useMemo(() => {
        if (data != null) {
            return data.data.instances ?? []
        } else {
            return []
        }
    }, [data]);
    useUpdateEffect(() => {
        if (orgUnit) {
            refetch({
                orgUnit: orgUnit?.id
            }).catch(console.error)
        }
    }, [orgUnit?.id, refetch])

    return {
        loading,
        refetch,
        categoryData,
        category: initialCategory,
        onPageChange,
        onPageSizeChange,
        ...pagination
    }
}
