import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { useCallback } from 'react'
import { get, head } from 'lodash'
import { uid } from '@hisptz/dhis2-utils'
import { useConfiguration } from '../../../../../../../../../../../../../../../shared/hooks/config'
import { Enrollment } from '../../../../../../../../../../../../../../../shared/types/dhis2'

const actionStatusMutation: any = {
    resource: 'tracker',
    type: 'create',
    data: ({ data }: { data: any, }) => data,
    params: ({ strategy }: { strategy?: string }) => (
        {
            importStrategy: strategy ?? 'CREATE_AND_UPDATE',
            importMode: 'COMMIT',
            async: false,
            validationMode: 'FAIL_FAST'
        }
    )
}

export function generateEvent (data: Record<string, any>, {
    orgUnit,
    program,
    programStage,
    enrollment,
    trackedEntity
}: {
    orgUnit: string;
    program: string;
    programStage: string;
    enrollment: string;
    trackedEntity: string;
}) {

    const occurredAt = get(data, ['occurredAt'])

    delete data['occurredAt']

    return {
        event: uid(),
        program,
        programStage,
        orgUnit,
        trackedEntity,
        enrollment,
        status: 'ACTIVE',
        dataValues: Object.entries(data).map(([key, value]) => {
            return {
                dataElement: key,
                value
            }
        }),
        occurredAt
    }
}

export function updateEvent (data: Record<string, any>, event: any) {
    const occurredAt = get(data, ['occurredAt'])
    delete data['occurredAt']
    const dataValues = Object.entries(data).map(([key, value]) => {
        return {
            dataElement: key,
            value
        }
    })

    return {
        ...event,
        dataValues,
        occurredAt
    }
}

export function useManageActionStatus ({
                                           instance,
                                           onComplete,
                                           defaultValue
                                       }: {
    instance: any, onComplete: () => void, defaultValue?: any
}) {
    const { show } = useAlert(({ message }) => message, ({ type }) => ({
        ...type,
        duration: 3000
    }))
    const [uploadPayload, { loading, }] = useDataMutation(actionStatusMutation, {
        onComplete: () => {
            onComplete()
        },
        onError: () => {
            show({
                message: i18n.t('Failed to create status', {}),
                type: { critical: true }
            })
        }
    })
    const { config } = useConfiguration()

    const actionStatusProgramStage = config?.action?.statusConfig?.id as string

    const onSave = useCallback(async (data: Record<string, any>,) => {
        if (defaultValue) {
            await uploadPayload({
                data: {
                    events: [
                        updateEvent(data, defaultValue)
                    ]
                }
            })
            show({
                message: i18n.t('Successfully updated status', {}),
                type: { success: true }
            })

        } else {

            const enrollment = head(instance.enrollments) as Enrollment
            const event = generateEvent(data, {
                orgUnit: enrollment.orgUnit,
                program: enrollment.program,
                programStage: actionStatusProgramStage,
                enrollment: enrollment.enrollment,
                trackedEntity: instance.trackedEntity
            })
            await uploadPayload({
                data: {
                    events: [
                        event
                    ]
                }
            })
            show({
                message: i18n.t('Successfully created status', {}),
                type: { success: true }
            })
        }
    }, [defaultValue])

    const onDelete = useCallback(async () => {
        if (!defaultValue) return
        await uploadPayload({
            data: {
                events: [
                    {
                        event: defaultValue.event,
                    }
                ]
            },
            strategy: 'DELETE'
        })
        show({
            message: i18n.t('Successfully deleted status', {}),
            type: { success: true }
        })
    }, [defaultValue])

    return {
        onSave,
        onDelete,
        saving: loading
    }
}
