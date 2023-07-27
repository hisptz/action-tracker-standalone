import React from 'react'
import { Field } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useController, useWatch } from 'react-hook-form'
import { OrgUnitSelector } from '@hisptz/dhis2-ui'
import { OrgUnitSelectByGroup } from './OrgUnitSelectionByLevel'
import { OrgUnitSelectByLevel } from './OrgUnitSelectionByGroup'

export function OrganisationUnitSelection () {
    const namespace = `general.orgUnit`
    const { field } = useController({
        name: `${namespace}.orgUnits`
    })

    const accessAll = useWatch({
        name: `${namespace}.accessAll`
    })

    return (
        <Field helpText={i18n.t('{{count}} organisation unit selected', { count: field.value?.length ?? 0 })}
               label={i18n.t('Organisation units')}>
            <div className="row gap-8 w-100">
                <div className="flex-1">
                    {
                        !accessAll && <OrgUnitSelector
                            searchable
                            value={{
                                orgUnits: field.value ?? []
                            }}
                            onUpdate={({ orgUnits }) => {
                                field.onChange(orgUnits)
                            }}
                        />
                    }
                </div>
                <div className="column gap-16">
                    <OrgUnitSelectByLevel field={field}/>
                    <OrgUnitSelectByGroup field={field}/>
                </div>
            </div>
        </Field>
    )
}
