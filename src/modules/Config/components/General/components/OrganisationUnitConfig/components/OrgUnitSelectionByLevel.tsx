import React, { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { uniqBy } from 'lodash'
import { Button, ButtonStrip, MultiSelectField, MultiSelectOption } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

const orgUnitGroup = {
    groups: {
        resource: 'organisationUnitGroups',
        params: {
            fields: [
                'id',
                'displayName',
                'organisationUnits[id]'
            ]
        }
    }
}

const orgUnitsInGroup: any = {
    orgUnits: {
        resource: 'organisationUnits',
        params: ({ groups }: { groups: string[] }) => ({
            filter: [
                `organisationUnitGroups.id:in:[${groups.join(',')}]`
            ],
            paging: false,
            fields: [
                'id',
                'path'
            ]
        })
    }
}

export function OrgUnitSelectByGroup ({ field }: {
    field: { value: Array<{ id: string }>, onChange: (value: Array<{ id: string }>) => void }
}) {
    const [selectedGroups, setSelectedGroups] = useState<string[] | null>(null)
    const {
        data,
        loading
    } = useDataQuery<{
        groups: {
            organisationUnitGroups: Array<{
                id: string
                displayName: string
                organisationUnits: Array<{ id: string }>
            }>
        }
    }>(orgUnitGroup)

    const {
        loading: orgUnitsLoading,
        refetch
    } = useDataQuery<{ orgUnits: { organisationUnits: Array<{ id: string }> } }>(orgUnitsInGroup, { lazy: true })

    const onSelect = async () => {
        if (selectedGroups) {
            const response = await refetch({ groups: selectedGroups }) as {
                orgUnits: { organisationUnits: Array<{ id: string }> }
            }
            field.onChange(uniqBy([...(field.value ?? []), ...response.orgUnits.organisationUnits], 'id'))
        }
    }

    const onDeselect = async () => {
        if (selectedGroups) {
            const response = await refetch({ groups: selectedGroups }) as {
                orgUnits: { organisationUnits: Array<{ id: string }> }
            }
            if (field.value) {
                field.onChange(field.value.filter(orgUnit => !response.orgUnits.organisationUnits.find(ou => ou.id === orgUnit.id)))
            }
        }
    }

    return (
        <div data-test="org-unit-group-access-selector" className="row gap-8 align-end">
        <MultiSelectField selected={selectedGroups ?? []}
    onChange={({ selected }: { selected: string[] }) => {
        setSelectedGroups(selected)
    }}
    loading={loading} label={i18n.t('Organisation unit group')}>
        {
            data?.groups?.organisationUnitGroups.map(({
                                                          id,
                                                          displayName
                                                      }) => {
            return (
                <MultiSelectOption key={`${id}-option`} value={`${id}`} label={displayName}/>
        )
        })
}
    </MultiSelectField>
    <ButtonStrip>
    <Button onClick={onSelect} loading={orgUnitsLoading}>{i18n.t('Select')}</Button>
        <Button onClick={onDeselect} loading={orgUnitsLoading}>{i18n.t('Deselect')}</Button>
        </ButtonStrip>
        </div>
)
}
