import { useCallback } from 'react'
import { uid } from '@hisptz/dhis2-utils'
import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import { useFormMeta } from './metadata'
import { useDimensions } from '../../../hooks'
import i18n from '@dhis2/d2-i18n'
import { ParentConfig } from '../../../schemas/config'
import { fromPairs, get, head, isEmpty } from 'lodash'
import { useConfiguration } from '../../../hooks/config'
import { DataElement, TrackedEntityAttribute } from '../../../types/dhis2'
import { useUploadFile } from '../../../hooks/files'
import { asyncify, mapSeries } from 'async'

const mutation: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ data }: { data: any }) => data,
    params: ({ strategy }: { strategy?: string }) => ({
        importStrategy: strategy ?? 'CREATE_AND_UPDATE',
        importMode: 'COMMIT',
        async: false,
        validationMode: 'FAIL_FAST'
    })
}

function generateTei (data: Record<string, any>, {
    orgUnit,
    program,
    trackedEntityType,
    parent,
    linkageConfig
}: {
    orgUnit: string;
    program: string;
    trackedEntityType: string;
    parent?: { id: string },
    parentConfig?: ParentConfig;
    linkageConfig: {
        trackedEntityAttribute: string;
    }
}) {
    const attributes = Object.entries(data).map(([key, value]) => {
        return {
            attribute: key,
            value
        }
    })

    if (parent) {
        const parentId = parent.id
        attributes.push({
            attribute: linkageConfig.trackedEntityAttribute,
            value: parentId
        })
    }

    const teiId = uid()

    return {
        trackedEntity: teiId,
        trackedEntityType,
        orgUnit,
        enrollments: [
            {
                enrollment: uid(),
                enrolledAt: new Date().toISOString(),
                occurredAt: new Date().toISOString(),
                trackedEntity: teiId,
                trackedEntityType,
                program,
                orgUnit,
                status: 'ACTIVE',
                events: [],
                attributes,
            }
        ]
    }
}

function updateTei (data: Record<string, any>, tei: any, fields: TrackedEntityAttribute[]) {
    const attributes = Object.keys(data).map((key) => {
        return {
            attribute: key,
            value: data[key]
        }
    })
    return {
        ...tei,
        attributes,
        enrollments: [
            {
                ...(head(tei.enrollments) ?? {}),
                events: [],
                attributes
            }
        ]
    }
}

function generateRelationship ({
                                   parentConfig,
                                   parent,
                                   instance,
                                   instanceType
                               }: {
    parentConfig: ParentConfig,
    parent: { id: string },
    instance: string,
    instanceType: string;
}) {

    const parentType = parentConfig.type === 'program' ? 'enrollment' : 'event'
    const childType = instanceType === 'program' ? 'enrollment' : 'event'

    return {
        relationship: uid(),
        relationshipType: parentConfig.id,
        from: {
            [parentType]: {
                [parentType]: parent.id
            }
        },
        to: {
            [childType]: {
                [childType]: instance
            }
        }
    }
}

export function generateEvent (data: Record<string, any>, {
    orgUnit,
    program,
    programStage,
    enrollment,
    trackedEntity,
    parent,
    linkageConfig
}: {
    orgUnit: string;
    program: string;
    programStage: string;
    enrollment: string;
    trackedEntity: string;
    parent?: { id: string },
    linkageConfig: {
        dataElement: string;
    }
}) {

    const dataValues = Object.entries(data).map(([key, value]) => {
        return {
            dataElement: key,
            value
        }
    })

    if (parent) {
        const parentId = parent.id
        dataValues.push({
            dataElement: linkageConfig.dataElement,
            value: parentId
        })
    }

    return {
        event: uid(),
        program,
        programStage,
        orgUnit,
        trackedEntity,
        enrollment,
        status: 'ACTIVE',
        dataValues,
        occurredAt: new Date().toISOString()
    }
}

export function updateEvent (data: Record<string, any>, event: any, fields: DataElement[]) {
    const dataValues = Object.keys(data)?.map((key) => {
        return {
            dataElement: key,
            value: data[key]
        }
    })

    return {
        ...event,
        dataValues,
    }
}

export function useFormActions ({
                                    instanceMetaId,
                                    type,
                                    instanceName,
                                    onComplete,
                                    parent,
                                    parentConfig,
                                    defaultValue
                                }: {
    instanceName: string;
    instanceMetaId: string;
    type: 'program' | 'programStage',
    parentConfig?: ParentConfig,
    parent?: { id: string, instance: any },
    onComplete: () => void;
    defaultValue: any
}) {
    const { config } = useConfiguration()
    const { orgUnit } = useDimensions()
    const {
        uploadFile,
        uploading
    } = useUploadFile()
    const {
        instanceMeta,
        fields,
    } = useFormMeta({
        id: instanceMetaId,
        type
    })
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const [uploadPayload, { loading: saving }] = useDataMutation(mutation, {
        onComplete: () => {
            if (defaultValue) {
                show({
                    message: i18n.t('Successfully updated {{name}}', {
                        name: instanceName
                    }),
                    type: { success: true }
                })
            } else {
                show({
                    message: i18n.t('Successfully created {{name}}', {
                        name: instanceName
                    }),
                    type: { success: true }
                })
            }
            if (onComplete) {
                onComplete()
            }
        },
        onError: () => {
            show({
                message: i18n.t('Failed to {{action}} {{name}}', {
                    name: instanceName,
                    action: defaultValue ? i18n.t('update') : i18n.t('create')
                }),
                type: { critical: true }
            })
        }
    })

    const uploadFiles = async (data: Record<string, any>) => {
        const fileFields = fields.filter(({ valueType }) => valueType === 'FILE_RESOURCE')
        if (isEmpty(fileFields)) return data
        const fileData = fromPairs(await mapSeries(fileFields, asyncify(async (field: { name: string }) => {
            const value = await uploadFile({
                file: data[field.name]
            })
            return [
                field.name,
                value
            ]
        })) as Array<[string, string]>)

        return {
            ...data,
            ...fileData
        }
    }

    const onSave = useCallback(async (rawData: Record<string, any>) => {
        const data = await uploadFiles(rawData)
        if (type === 'program') {
            //Create a tei and enrollment
            if (defaultValue) {
                const enrollment = updateTei(data, defaultValue, instanceMeta?.programTrackedEntityAttributes.map(({ trackedEntityAttribute }: {
                    trackedEntityAttribute: TrackedEntityAttribute
                }) => trackedEntityAttribute))
                await uploadPayload({
                    data: {
                        trackedEntities: [
                            enrollment
                        ]
                    }
                })
                show({
                    message: i18n.t('Successfully updated {{name}}', {
                        name: instanceName
                    }),
                    type: { success: true }
                })
            } else {
                const tei = generateTei(data, {
                    orgUnit: orgUnit?.id as string,
                    trackedEntityType: instanceMeta?.trackedEntityType?.id,
                    program: instanceMeta?.id as string,
                    parent,
                    linkageConfig: config?.meta.linkageConfig as any
                })
                const payload = {
                    trackedEntities: [tei]
                }
                await uploadPayload({ data: payload })
                show({
                    message: i18n.t('Successfully created {{name}}', {
                        name: instanceName
                    }),
                    type: { success: true }
                })
            }
        } else {
            if (defaultValue) {
                const updatedEvent = updateEvent(data, defaultValue, instanceMeta?.programStageDataElements.map(({ dataElement }: {
                    dataElement: DataElement
                }) => dataElement))
                await uploadPayload({
                    data: {
                        events: [
                            updatedEvent
                        ]
                    }
                })
            } else {
                if (!parent || !parentConfig) {
                    throw new Error('Parent instance is required for events')
                }
                let trackedEntity
                let enrollment

                if (parentConfig?.type === 'program') {
                    //Parent instance is a tracked entity
                    trackedEntity = parent.instance.trackedEntity
                    enrollment = get(parent.instance, ['enrollments', 0, 'enrollment'], '')
                } else {
                    //Parent instance is an event
                    enrollment = parent.instance.enrollment
                    trackedEntity = parent.instance.trackedEntity
                }

                const event = generateEvent(data, {
                    orgUnit: orgUnit?.id as string,
                    program: instanceMeta?.program?.id as string,
                    programStage: instanceMeta?.id as string,
                    trackedEntity,
                    enrollment,
                    parent,
                    linkageConfig: config?.meta.linkageConfig as any
                })

                const payload = {
                    events: [event],
                }
                await uploadPayload({ data: payload })
            }
        }
    }, [instanceMeta, orgUnit, uploadPayload, type])

    return {
        onSave,
        saving: saving || uploading,
    }
}

export function useDeleteInstance (type: 'program' | 'programStage', { instanceName }: {
    instanceName: string
}) {
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const [uploadPayload, { loading: deleting }] = useDataMutation(mutation, {
        onComplete: () => {
            show({
                message: i18n.t('Successfully deleted {{instanceName}}', {
                    instanceName
                }),
                type: { success: true }
            })
        },
        onError: (error) => {
            show({
                    message: `${i18n.t('Failed to delete')}: ${error.message}`,
                    type: { critical: true }
                }
            )
        }
    })
    const onDelete = useCallback(async (defaultValue: any) => {
        const payload = type === 'program' ? {
            enrollments: [{
                enrollment: defaultValue.enrollment
            }]
        } : {
            events: [{
                event: defaultValue.event
            }]
        }
        await uploadPayload({
            data: payload,
            strategy: 'DELETE'
        })
    }, [])

    return {
        deleting,
        onDelete
    }
}
