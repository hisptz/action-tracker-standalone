import { RHFDHIS2FormFieldProps } from '@hisptz/dhis2-ui'
import i18n from '@dhis2/d2-i18n'
import { DataField } from '../schemas/config'

export function getFieldProps ({
                                   name,
                                   mandatory,
                                   id,
                                   type,
                                   optionSet
                               }: DataField): RHFDHIS2FormFieldProps {
    return {
        label: name,
        name: id,
        valueType: type as any,
        required: mandatory,
        optionSet,
        validations: {
            required: {
                value: mandatory,
                message: i18n.t('This field is required')
            }
        }
    }
}
