import { useCallback, useState } from 'react'
import { Config } from '../../../shared/schemas/config'
import { useDataMutation, useDataQuery } from '@dhis2/app-runtime'
import { find, flattenDeep, get, head, last, tail } from 'lodash'
import { Event, TrackedEntity } from '../../../shared/types/dhis2'
import { migrateData } from '../../../shared/utils/data-migrate'
import { asyncify, mapSeries } from 'async'
import { TrackedEntityInstance } from '@hisptz/dhis2-utils'

const query: any = {
    data: {
        resource: 'tracker/trackedEntities',
        params: ({
                     program,
                     page,
                     pageSize
                 }: { program: string; page: number, pageSize: number }) => {
            return {
                program,
                ouMode: 'ACCESSIBLE',
                page,
                pageSize,
                totalPages: true,
                fields: [
                    'orgUnit',
                    'trackedEntity',
                    'attributes[attribute,value]',
                    'enrollments[enrollment,enrolledAt,occurredAt,orgUnit,program,events[event,occurredAt,orgUnit,program,programStage,dataValues[dataElement,value]]]'
                ]
            }
        }
    }
}

const relationshipQuery: any = {
    data: {
        resource: 'relationships',
        params: ({ trackedEntity }: { trackedEntity: string }) => ({
            trackedEntity,
            tei: trackedEntity,
            fields: [
                'to[trackedEntity[trackedEntity,trackedEntityType,orgUnit,attributes[attribute,value]]]'
            ]
        })
    }
}

const mutation: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ payload }: any) => payload,
    params: {
        importStrategy: 'CREATE_AND_UPDATE',
        importMode: 'COMMIT',
        async: false,
        validationMode: 'FAIL_FAST',
        atomicMode: 'ALL'
    }
}

export function useMigrateData () {
    const [progress, setProgress] = useState(0)
    const {
        refetch,
        loading: gettingBottlenecks
    } = useDataQuery(query, { lazy: true })
    const {
        refetch: getActions,
        loading: gettingActions
    } = useDataQuery(relationshipQuery, { lazy: true })
    const [upload, { loading: uploading }] = useDataMutation(mutation)

    const onEachBottleneckMigrate = async (trackedEntity: TrackedEntity, { config }: { config: Config }) => {
        try {
            const childCategories = tail(config.categories)
            const events = get(trackedEntity, ['enrollments', 0, 'events'])
            const gapEvents = events.filter(({ programStage }) => programStage === head(childCategories)?.id)
            const solutionEvents = events.filter(({ programStage }) => programStage === last(childCategories)?.id)
            const updatedGapEvents = migrateData({
                parent: trackedEntity,
                children: gapEvents as unknown as Event[],
                childrenAreEvents: true,
                linkageConfig: config.meta.linkageConfig
            })

            const updatedSolutionEvents = gapEvents.map((event) => {
                const children = solutionEvents.filter((solutionEvent) => {
                    const linkageId = 'kBkyDytdOmC'
                    const gapValue = find(event.dataValues, { dataElement: linkageId })?.value
                    const solutionValue = find(solutionEvent.dataValues, { dataElement: linkageId })?.value
                    return gapValue === solutionValue
                })
                return migrateData({
                    parent: event as unknown as Event,
                    childrenAreEvents: true,
                    children: children as unknown as Event[],
                    linkageConfig: config.meta.linkageConfig
                })
            })
            const updatedEvents = [...updatedGapEvents, ...updatedSolutionEvents] as Event[]

            const actionsResponse: {
                data: { to: { trackedEntityInstance: TrackedEntityInstance } }[]
            } = await getActions({
                trackedEntity: get(trackedEntity, ['trackedEntity'])
            }) as any

            const actions = actionsResponse.data?.map(({ to }) => to.trackedEntityInstance)

            const updatedActions = solutionEvents.map((solutionEvent) => {
                const solutionActions = actions?.filter((action) => {
                    const actionLinkageValue = find(action.attributes, { attribute: 'Y4CIGFwWYJD' })?.value
                    const solutionLinkageValue = find(solutionEvent.dataValues, { dataElement: 'prX0q7amAni' })?.value
                    return actionLinkageValue === solutionLinkageValue
                })

                return migrateData({
                    parent: solutionEvent as unknown as Event,
                    childrenAreEvents: false,
                    children: solutionActions,
                    linkageConfig: config.meta.linkageConfig

                })
            })

            const payload = {
                events: flattenDeep(updatedEvents),
                trackedEntities: flattenDeep(updatedActions)
            }

            return await upload({
                payload
            })
        } catch (e) {
            console.error(e)
            return false
        }

    }

    const onEachPageMigrate = async (page: number, {
        program,
        config
    }: { config: Config, program: string }) => {
        try {
            const data: { data: { instances: TrackedEntity[] } } = await refetch({
                page,
                program
            }) as any
            return await mapSeries(data.data.instances, asyncify(async (instance: TrackedEntity) => await onEachBottleneckMigrate(instance, { config })))
        } catch (e) {
            console.error(e)
            return false
        }
    }

    const migrate = useCallback(async (config: Config) => {
        const mainCategory = head(config.categories)
        if (!mainCategory) return
        const pagination: {
            data: {
                page: number,
                pageSize: number,
                total: number,
            }
        } = await refetch({
            program: mainCategory.id
        }) as any

        const pages = Array.from(Array(Math.ceil(pagination.data.total / pagination.data.pageSize)).keys()).map((key) => key + 1)

        await mapSeries(pages, asyncify(async (page: number) => await onEachPageMigrate(page, {
            config,
            program: mainCategory.id
        }).then((res) => {
            setProgress((page / pages.length) * 100)
            return res
        })))

    }, [refetch])

    return {
        migrate,
        progress,
        loading: gettingActions || gettingBottlenecks || uploading
    }
}
