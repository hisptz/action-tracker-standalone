import { ActionConfig, ActionStatusConfig, CategoryConfig } from '../../schemas/config'
import { useMetadata } from '../../hooks/metadata'
import React, { useMemo } from 'react'
import { compact, find } from 'lodash'
import { FileView } from './compoents/FileView/FileView'
import { Event, TrackedEntity } from '../../types/dhis2'
import { formatDate } from '../../utils/date'

export interface DataViewProps {
    instance: TrackedEntity | Event
    fieldId: string;
    instanceConfig: CategoryConfig | ActionConfig | ActionStatusConfig,
    value: string;
    small?: boolean
}

export function DataView ({
                              instanceConfig,
                              instance,
                              fieldId,
                              value,
                              small
                          }: DataViewProps) {
    const { programs } = useMetadata()
    const programStages = useMemo(() => compact(programs?.map(({ programStages }) => programStages).flat()) ?? [], [])
    const fieldMetadata = useMemo(() => {
        if (!(instanceConfig as CategoryConfig).type || (instanceConfig as CategoryConfig).type === 'programStage') {
            //Action status
            const stage = find(programStages, { id: instanceConfig.id })

            return find(stage?.programStageDataElements, ({ dataElement }) => dataElement.id === fieldId)?.dataElement
        }
        const program = find(programs, { id: instanceConfig.id })
        return find(program?.programTrackedEntityAttributes, ({ trackedEntityAttribute }) => trackedEntityAttribute.id === fieldId)?.trackedEntityAttribute
    }, [programStages, programs])

    const getViewType = () => {
        if (fieldMetadata?.optionSet?.id) {
            const options = fieldMetadata?.optionSet?.options
            return find(options, { code: value })?.name ?? null
        }

        if (!value) {
            return null
        }

        switch (fieldMetadata?.valueType as any) {
            case 'TEXT':
            case 'LONG_TEXT':
                return value
            case 'DATE':
                return formatDate(value)
            case 'FILE_RESOURCE':
                return <FileView small={small}
                                 type={(instanceConfig as CategoryConfig | ActionConfig).type ?? 'programStage'}
                                 instance={instance} field={fieldMetadata as any}/>
            default:
                return value
        }
    }

    return getViewType() ?? null
}
