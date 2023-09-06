import { RHFDHIS2FormFieldProps } from '@hisptz/dhis2-ui'
import i18n from '@dhis2/d2-i18n'
import { DataField } from '../schemas/config'
import { isEmpty } from 'lodash'
import { z } from 'zod'
import { PeriodInterface } from '@hisptz/dhis2-utils'
import { Attribute } from '../types/dhis2'
import valueType = Attribute.valueType

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
        optionSet: isEmpty(optionSet) ? undefined : optionSet,
    }
}

export function getFieldSchema (field: DataField, { period }: { period: PeriodInterface }) {
    const schema = z.string({ required_error: i18n.t('This field is required') })
    if (!field.mandatory) {
        schema.optional()
    }

    if (field.type === valueType.FILE_RESOURCE) {
        return z.any()
    }

    if (field.isStartDate) {
        return schema.refine((value) => {
            return new Date(value) >= period.startDate
        }, i18n.t('The start date should not be before the selected planned date'))
    }

    if (field.isEndDate) {
        return schema.refine((value) => {
            return new Date(value) <= period.end.plus({ day: 1 }).toJSDate()
        }, i18n.t('The start date should not be after the selected planned date'))
    }

    return schema
}
