import React from 'react'
import { Field } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import { useController } from 'react-hook-form'
import { OrgUnitSelector } from '@hisptz/dhis2-ui'
import { OrgUnitSelectByGroup } from './OrgUnitSelectionByLevel'
import { OrgUnitSelectByLevel } from './OrgUnitSelectionByGroup'
import { AllSelector } from './AllSelector'

export function OrganisationUnitSelection () {
    const namespace = `general.orgUnit`
    const { field } = useController({
        name: `${namespace}.orgUnits`
    })

    const selectedOrgUnitsCount = field?.value?.length ?? 0

    return (
        <Field id="org-unit-access-container" dataTest="org-unit-access"
               helpText={i18n.t('{{count}} organisation unit(s) selected', { count: selectedOrgUnitsCount })}
               label={i18n.t('Allow planning and tracking for these organisation units')}>
            <div className="row gap-8 w-100">
                <div className="flex-1">
                    <OrgUnitSelector
                        searchable
                        value={{
                            orgUnits: field.value ?? []
                        }}
                        onUpdate={({ orgUnits }) => {
                            field.onChange(orgUnits)
                        }}
                    />
                </div>
                <div className="column gap-16">
                    <OrgUnitSelectByLevel field={field}/>
                    <OrgUnitSelectByGroup field={field}/>
                    <AllSelector field={field}/>
                </div>
            </div>
        </Field>
    )
}
