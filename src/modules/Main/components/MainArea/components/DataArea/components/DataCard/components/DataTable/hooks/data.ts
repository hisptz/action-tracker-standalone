import { useDataQuery } from '@dhis2/app-runtime'
import { useDimensions } from '../../../../../../../../../../../shared/hooks'
import { useEffect, useMemo } from 'react'
import { fromPairs, isEmpty } from 'lodash'
import { useConfiguration } from '../../../../../../../../../../../shared/hooks/config'
import { Event, TrackedEntity } from '../../../../../../../../../../../shared/types/dhis2'
import { Config } from '../../../../../../../../../../../shared/schemas/config'
import { BasePeriod } from '@hisptz/dhis2-utils'
import { formatDate } from '../../../../../../../../../../../shared/utils/date'

const trackedEntitiesQuery: any = {
    data: {
        resource: 'tracker/trackedEntities',
        params: ({

                     page,
                     pageSize,
                     ou,
                     filter,
                     program
                 }: any) => ({
            page,
            program,
            filter: [filter],
            pageSize,
            orgUnit: ou,
            ouMode: 'DESCENDANTS',
            totalPages: true,
            order: 'createdAt:asc',
            fields: [
                'trackedEntity',
                'trackedEntityType',
                'orgUnit',
                'attributes[attribute,valueType,value]',
                'enrollments[enrollment,orgUnit,program,enrolledAt,occurredAt]'
            ],
        })
    }
}
const eventsQuery: any = {
    data: {
        resource: 'tracker/events',
        params: ({
                     page,
                     pageSize,
                     ou,
                     filter
                 }: any) => ({
            page,
            pageSize,
            filter: [
                filter
            ],
            orgUnit: ou,
            ouMode: 'DESCENDANTS',
            totalPages: true,
            order: 'createdAt:asc',
            fields: [
                'event',
                'enrollment',
                'occurredAt',
                'orgUnit',
                'program', 'programStage',
                'dataValues[dataElement,valueType,value]',
            ],
        })
    }
}

export function getPeriodQuery (config: Config, period: BasePeriod) {
    const startDateId = config.action.fields.find(({ isStartDate }) => isStartDate)?.id
    const endDateId = config.action.fields.find(({ isEndDate }) => isEndDate)?.id

    const {
        start,
        end
    } = period
    return [
        `${startDateId}:GE:${start.toFormat('yyyy-MM-dd')}`,
        `${endDateId}:LE:${end.toFormat('yyyy-MM-dd')}`,
    ]
}

export function useTableData (type: 'program' | 'programStage', {
    parentInstance,
    parentType
}: {
    parentInstance: any,
    parentType: 'program' | 'programStage'
}) {
    const { config } = useConfiguration()
    const {
        orgUnit,
        period
    } = useDimensions()
    const {
        data,
        refetch,
        loading,
        error
    } = useDataQuery<{
        data: { instances: Array<Event> | Array<TrackedEntity>, page: number, pageSize: number, total: number }
    }>(type === 'program' ? trackedEntitiesQuery : eventsQuery, {
        variables: {
            program: type === 'program' ? config?.action.id : undefined,
            ou: orgUnit?.id,
            page: 1,
            pageSize: 10,
            filter: [
                `${type === 'program' ? config?.meta.linkageConfig.trackedEntityAttribute : config?.meta.linkageConfig.dataElement}:eq:${parentType === 'program' ? parentInstance?.trackedEntity : parentInstance?.event}`,
                ...(type === 'program' ? getPeriodQuery(config as Config, period as BasePeriod) : [])
            ],

        }
    })

    const rawData = useMemo(() => {
        return data?.data?.instances || []
    }, [data])

    const rows = useMemo(() => {
        return rawData?.map((instance) => {
            const data = type === 'program' ? (instance as TrackedEntity).attributes : (instance as Event).dataValues

            return {
                ...fromPairs(data?.map((item: any) => {
                    const valueType = item.valueType
                    let value = item.value

                    if (valueType === 'DATE') {
                        value = formatDate(value)
                    }
                    return [item.attribute ?? item.dataElement, value]
                })),
                instance
            } as Record<string, any>
        })
    }, [rawData])

    const noData = useMemo(() => isEmpty(rawData), [rawData])

    const pagination = useMemo(() => {
        return {
            page: data?.data?.page ?? 1,
            pageSize: data?.data?.pageSize ?? 10,
            total: data?.data?.total ?? 1,
            pageCount: Math.ceil((data?.data?.total ?? 1) / (data?.data?.pageSize ?? 1)),
            onPageChange: (page: number) => {
                refetch({
                    page
                })
            },
            onPageSizeChange: (pageSize: number) => {
                refetch({
                    pageSize,
                    page: 1
                })
            }
        }
    }, [data, refetch])

    useEffect(() => {
        if (type === 'program') {
            refetch({
                filter: [
                    `${type === 'program' ? config?.meta.linkageConfig.trackedEntityAttribute : config?.meta.linkageConfig.dataElement}:eq:${parentType === 'program' ? parentInstance?.trackedEntity : parentInstance?.event}`,
                    ...(type === 'program' ? getPeriodQuery(config as Config, period as BasePeriod) : [])
                ]
            })
        }
    }, [period])

    return {
        loading,
        noData,
        refetch,
        error,
        rows,
        pagination
    }
}
