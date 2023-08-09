import { useConfiguration } from '../../../../../../../../../../../../../../../shared/hooks/config'
import { useMetadata } from '../../../../../../../../../../../../../../../shared/hooks/metadata'
import { find, fromPairs } from 'lodash'
import { getFieldProps, getFieldSchema } from '../../../../../../../../../../../../../../../shared/utils/form'
import { ActionTrackingColumnStateConfig } from '../../../../../../../state/columns'
import { useMemo } from 'react'
import { RHFDHIS2FormFieldProps } from '@hisptz/dhis2-ui'
import { z } from 'zod'
import { PeriodInterface } from '@hisptz/dhis2-utils'
import { useDimensions } from '../../../../../../../../../../../../../../../shared/hooks'

export function useFormMeta ({ columnConfig }: { columnConfig: ActionTrackingColumnStateConfig }) {
    const { period } = useDimensions()
    const { config } = useConfiguration()
    const actionStatusConfig = config?.action.statusConfig
    const { programs } = useMetadata()
    const actionStatusProgramStageConfig = find(find(programs, ['id', config?.action.id])?.programStages, ['id', actionStatusConfig?.id])

    const fields = useMemo(() => {
        const dataElements = actionStatusProgramStageConfig?.programStageDataElements?.map(({ dataElement }) => dataElement)

        const fields = config?.action.statusConfig.fields.map((fieldConfig) => {
            const dataElement = find(dataElements, { id: fieldConfig.id })
            return getFieldProps({
                ...fieldConfig,
                ...(dataElement ?? {})
            })
        }) ?? []

        const period = columnConfig.period
        const eventDateField = {
            name: 'occurredAt',
            valueType: 'DATE',
            required: true,
            label: config?.action.statusConfig.dateConfig.name,
            min: period.start.toFormat('yyyy-MM-dd'),
            max: period.end.toFormat('yyyy-MM-dd'),
        } as RHFDHIS2FormFieldProps

        return [
            eventDateField,
            ...fields
        ]

    }, [actionStatusProgramStageConfig])

    const schema = useMemo(() => {
        const schema = z.object(fromPairs(config?.action.statusConfig?.fields?.filter(({ hidden }) => !hidden)?.map((field) => [field.id, getFieldSchema(field, { period: period?.get() as PeriodInterface })]),))

        return schema.extend({
            occurredAt: z.string()
        })
    }, [config])

    return {
        fields,
        schema
    }
}
