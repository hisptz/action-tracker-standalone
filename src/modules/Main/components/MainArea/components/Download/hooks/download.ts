import i18n from '@dhis2/d2-i18n'
import { asyncify, mapSeries } from 'async'
import { useAlert, useDataEngine, useDataQuery } from '@dhis2/app-runtime'
import { useCallback, useEffect, useState } from 'react'
import { BasePeriod, Pagination } from '@hisptz/dhis2-utils'
import { useConfiguration } from '../../../../../../../shared/hooks/config'
import { useDimensions } from '../../../../../../../shared/hooks'
import { Event, TrackedEntity } from '../../../../../../../shared/types/dhis2'
import { ActionConfig, CategoryConfig, Config } from '../../../../../../../shared/schemas/config'
import { find, flattenDeep, get, head, isEmpty, range } from 'lodash'
import { getPeriodQuery } from '../../DataArea/components/DataCard/components/DataTable/hooks/data'
import { downloadFile } from '../utils/download'

async function getPagination (
    refetch: any,
    {
        queryVariables,
        queryKey
    }: { queryVariables: Record<string, any>; queryKey: string }
): Promise<Pagination> {
    const data = await refetch({
        ...queryVariables,
        totalPages: true,
        skipData: true
    })
    return {
        page: get(data, [queryKey, 'page'], 1),
        pageSize: get(data, [queryKey, 'pageSize'], 50),
        total: get(data, [queryKey, 'total'], 50)
    } as Pagination
}

async function getData (
    refetch: any,
    {
        options,
        queryKey,
        resource,
        mapping,
        page,
    }: { options: any; queryKey: string; resource: string; mapping: any; page: number }
): Promise<Array<Record<string, any>>> {
    const data = await refetch({
        ...options,
        page
    })
    const rawData = get(data, [queryKey, resource])
    if (!isEmpty(rawData)) {
        console.log({ rawData })
        return await mapSeries(rawData, asyncify(mapping))
    }
    return []
}

export function useDownloadData ({
                                     query,
                                     queryKey,
                                     resource,
                                     mapping,
                                 }: {
    query: any;
    queryKey: string;
    resource: string;
    mapping: (data: any) => Promise<Array<Record<string, any>>>;
}) {
    const {
        show,
        hide
    } = useAlert(
        ({ message }) => message,
        ({ type }) => ({
            ...type,
            duration: 10000
        })
    )

    const [downloading, setDownloading] = useState(false)
    const [pageCount, setPageCount] = useState(0)
    const [progress, setProgress] = useState(0)

    const { refetch } = useDataQuery(query, { lazy: true })

    useEffect(() => {
        if (downloading && pageCount > 0) {
            show({
                type: {
                    info: true,
                },
                message: `${i18n.t('Downloading...')} ${progress}/${pageCount}`,
            })
        } else {
            hide()
        }
    }, [progress, show, downloading, pageCount, hide])

    const download = useCallback(
        async (type: 'xlsx' | 'csv' | 'json', queryVariables: Record<string, any>) => {
            try {
                setDownloading(true)
                const pagination = await getPagination(refetch, {
                    queryVariables: queryVariables,
                    queryKey,
                })
                if (pagination) {
                    const pageCount = pagination.pageCount ?? Math.ceil((pagination.total ?? 1) / (pagination.pageSize ?? 1))
                    setPageCount(pageCount)
                    const dataFetch = async (page: number) => {
                        return await getData(refetch, {
                            options: queryVariables,
                            queryKey,
                            resource,
                            mapping,
                            page,
                        }).then((data) => {
                            setProgress(page)
                            show({
                                type: {
                                    info: true,
                                },
                                message: `${i18n.t('Downloading...')} ${progress}/${pageCount}`,
                            })
                            return data
                        })
                    }
                    if (pageCount >= 1) {
                        const data = flattenDeep(
                            await mapSeries(range(1, pageCount + 1), asyncify(dataFetch))
                        )
                        await downloadFile(type, data)
                    }
                }
            } catch (e: any) {
                show({
                    message: e.message,
                    type: { critical: true }
                })
                setTimeout(() => hide(), 5000)
            } finally {
                setDownloading(false)
                setProgress(0)
                setPageCount(0)
                hide()
            }
        },
        [hide, mapping, queryKey, refetch, resource, show]
    )

    return {
        download,
        downloading,
    }
}

const actionQuery = {
    actions: {
        resource: 'tracker/trackedEntities',
        params: ({
                     program,
                     filter,
                 }: any) => {
            return {
                ouMode: 'ALL',
                program,
                filter,
                paging: false,
                fields: [
                    'trackedEntity',
                    'attributes[attribute,value]',
                    'enrollments[enrollment,events[programStage,program,dataValues[dataElement,value]]]'
                ]
            }
        }
    }
}

const query = {
    data: {
        resource: 'tracker/trackedEntities',
        params: ({
                     program,
                     orgUnit,
                     pageSize,
                     page
                 }: {
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
                totalPages: true,
                fields: [
                    'trackedEntity',
                    'attributes[attribute,value]',
                    'enrollments[events[event,program,programStage,occurredAt,dataValues[dataElement,value]]]'
                ]
            }
        }
    }
}

export function useDownload () {
    const engine = useDataEngine()
    const { config } = useConfiguration()
    const {
        orgUnit,
        period
    } = useDimensions()

    const getInstanceData = ({
                                 instance,
                                 config
                             }: {
        instance: TrackedEntity | Event,
        config: CategoryConfig | ActionConfig
    }) => {
        if (config.type === 'program') {
            return {
                values: config.fields.map((field) => {
                    return {
                        name: field.name,
                        id: field.id,
                        value: (find((instance as TrackedEntity).attributes, { attribute: field.id }))?.value
                    }
                })
            }
        }

        return {
            values: config.fields.map((field) => {
                return {
                    name: field.name,
                    id: field.id,
                    value: (find((instance as Event)?.dataValues, { dataElement: field.id }))?.value
                }
            })
        }

    }
    const getChildren = async ({
                                   parent,
                                   events,
                                   parentConfig
                               }: {
        parent: TrackedEntity | Event,
        events: Event[],
        parentConfig: CategoryConfig
    }): Promise<Array<TrackedEntity | Event>> => {
        if (parentConfig.child.type === 'programStage') {
            const childEvents = events?.filter(({
                                                    programStage,
                                                    dataValues
                                                }) => programStage === parentConfig.child.to && find(dataValues, { dataElement: config?.meta.linkageConfig.dataElement })?.value === ((parent as Event)?.event ?? (parent as TrackedEntity)?.trackedEntity))
            return mapSeries(childEvents, async (event: Event) => {
                const parentConfig = find(config?.categories, { id: event.programStage }) as CategoryConfig
                return {
                    ...(getInstanceData({
                        instance: event,
                        config: parentConfig
                    })),
                    children: await getChildren({
                        parent: event,
                        events,
                        parentConfig
                    })
                }
            })
        }
        const actions = await engine.query(actionQuery, {
            variables: {
                filter: [
                    `${config?.meta.linkageConfig.trackedEntityAttribute}:eq:${(parent as Event)?.event ?? (parent as TrackedEntity)?.trackedEntity}`,
                    `${getPeriodQuery(config as Config, period as BasePeriod)}`
                ],
                program: config?.action.id
            }
        }) as { actions: { instances: TrackedEntity[] } }
        return actions?.actions?.instances.map((instance) => getInstanceData({
            instance,
            config: config?.action as ActionConfig
        }))
    }

    const justAFunction = (instance: any) => {
        if (instance.children) {
            return [
                ...instance.values,
                ...(instance.children.map((instance: any) => justAFunction(instance)))
            ].flat()
        }
        return [
            ...instance.values
        ].flat()
    }

    const mapper = async (data: TrackedEntity) => {
        const instanceConfig = head(config?.categories) as CategoryConfig
        const events = head(data.enrollments)?.events as unknown as Event[]
        return {
            ...(getInstanceData({
                instance: data,
                config: instanceConfig
            })),
            children: await getChildren({
                parent: data,
                events,
                parentConfig: head(config?.categories) as CategoryConfig
            })
        }

    }

    const {
        download,
        downloading
    } = useDownloadData({
        query,
        queryKey: 'data',
        resource: 'instances',
        mapping: mapper as any
    })

    const onDownload = async (type: 'xlsx' | 'json' | 'csv') => {
        return await download(type, {
            program: head(config?.categories)?.id,
            orgUnit: orgUnit.id,
        })
    }

    return {
        download: onDownload,
        downloading
    }
}
