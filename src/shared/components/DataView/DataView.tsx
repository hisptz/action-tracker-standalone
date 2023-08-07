import { ActionConfig, ActionStatusConfig, CategoryConfig } from '../../schemas/config'
import { useMetadata } from '../../hooks/metadata'
import { useMemo } from 'react'
import { compact, find } from 'lodash'

export interface DataViewProps {
    fieldId: string;
    instanceConfig: CategoryConfig | ActionConfig | ActionStatusConfig,
    value: string;
}

export function DataView ({
                              instanceConfig,
                              fieldId,
                              value
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

        switch (fieldMetadata?.valueType) {
            case 'TEXT':
            case 'LONG_TEXT':
                return value
            default:
                return value
        }
    }

    return getViewType() ?? null
}
