import { useMetadata } from '../../../hooks/metadata'
import { useMemo } from 'react'
import { RHFDHIS2FormFieldProps } from '@hisptz/dhis2-ui'
import { getFieldProps } from '../../../utils/form'
import { useConfiguration } from '../../../hooks/config'

export function useFormMeta ({
                                 id,
                                 type
                             }: { id: string; type: 'program' | 'programStage' }) {
    const { config } = useConfiguration()
    const { programs } = useMetadata()
    const programStages = useMemo(() => programs?.map(program => program.programStages).flat(), [programs])
    const instanceConfig = useMemo(() => config?.categories.find((category) => category.id === id) ?? config?.action, [config, id])
    const instanceMeta = useMemo(() => {
        if (type === 'program') {
            return programs?.find(program => program.id === id)
        } else {
            return programStages?.find(programStage => programStage?.id === id)
        }
    }, [programs, programStages, id, type])

    const fields: RHFDHIS2FormFieldProps[] = useMemo(() => {
        const fieldsConfig = instanceConfig?.fields ?? []
        return fieldsConfig.filter(({ hidden }) => !hidden).map(field => getFieldProps(field))
    }, [instanceConfig])

    console.log(fields)

    return {
        fields,
        instanceMeta
    }

}
