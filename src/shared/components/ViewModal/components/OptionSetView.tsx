import { ActionConfig, ActionStatusConfig, CategoryConfig, DataField } from '../../../schemas/config'
import { useMetadata } from '../../../hooks/metadata'
import React, { useMemo } from 'react'
import { compact, find } from 'lodash'

export interface OptionViewProps {
    field: DataField,
    value: string;
    instanceConfig: CategoryConfig | ActionConfig | ActionStatusConfig
}

export function OptionView ({
                                field,
                                instanceConfig,
                                value
                            }: OptionViewProps) {
    const { programs } = useMetadata()
    const programStages = useMemo(() => compact(programs?.map(({ programStages }) => programStages).flat()) ?? [], [])
    const fieldMetadata = useMemo(() => {
        if (!(instanceConfig as CategoryConfig).type || (instanceConfig as CategoryConfig).type === 'programStage') {
            //Action status
            const stage = find(programStages, { id: instanceConfig.id })
            return find(stage?.programStageDataElements, ({ dataElement }) => dataElement.id === field.id)?.dataElement
        }
        const program = find(programs, { id: instanceConfig.id })
        return find(program?.programTrackedEntityAttributes, ({ trackedEntityAttribute }) => trackedEntityAttribute.id === field.id)?.trackedEntityAttribute
    }, [programStages, programs])

    const option = useMemo(() => {
        const options = fieldMetadata?.optionSet?.options
        return find(options, { code: value })

    }, [value, fieldMetadata])

    return (
        <>
            {option?.name ?? value}
        </>
    )
}
