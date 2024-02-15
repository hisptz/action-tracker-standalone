import React, { useState } from 'react'
import { useDataQuery } from '@dhis2/app-runtime'
import { uniqBy } from 'lodash'
import { Button, ButtonStrip, MultiSelectField, MultiSelectOption } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'

const orgUnitLevel = {
    levels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: [
                'id',
                'displayName',
                'level',
                'organisationUnits[id]'
            ]
        }
    }
}

const orgUnitsInLevel: any = {
    orgUnits: {
        resource: 'organisationUnits',
        params: ({ levels }: { levels: string[] }) => ({
            filter: [
                `level:in:[${levels.join(',')}]`
            ],
            paging: false,
            fields: [
                'id',
                'path'
            ]
        })
    }
}

export function OrgUnitSelectByLevel ({ field }: {
    field: { value: Array<{ id: string }>, onChange: (value: Array<{ id: string }>) => void }
}) {
    const [selectedLevels, setSelectedLevels] = useState<string[] | null>(null)
    const {
        data,
        loading
    } = useDataQuery<{
        levels: {
            organisationUnitLevels: Array<{
                id: string
                displayName: string
                level: number
                organisationUnits: Array<{ id: string }>
            }>
        }
    }>(orgUnitLevel)

    const {
        loading: orgUnitsLoading,
        refetch
    } = useDataQuery<{ orgUnits: { organisationUnits: Array<{ id: string }> } }>(orgUnitsInLevel, { lazy: true })

    const onSelect = async () => {
        if (selectedLevels) {
            const response = await refetch({ levels: selectedLevels }) as {
                orgUnits: { organisationUnits: Array<{ id: string }> }
            }
            field.onChange(uniqBy([...(field.value ?? []), ...response.orgUnits.organisationUnits], 'id'))
        }
    }

    const onDeselect = async () => {
        if (selectedLevels) {
            const response = await refetch({ levels: selectedLevels }) as {
                orgUnits: { organisationUnits: Array<{ id: string }> }
            }
            if (field.value) {
                field.onChange(field.value.filter(orgUnit => !response.orgUnits.organisationUnits.find(ou => ou.id === orgUnit.id)))
            }
        }
    }

    return (
        <div data-test="org-unit-level-access-selector" className="row gap-8 align-end">
        <MultiSelectField selected={selectedLevels ?? []}
    onChange={({ selected }: { selected: string[] }) => {
        setSelectedLevels(selected)
    }}
    loading={loading} label={i18n.t('Organisation unit level')}>
        {
            data?.levels?.organisationUnitLevels.map(({
                                                          id,
                                                          displayName,
                                                          level
                                                      }) => {
            return (
                <MultiSelectOption key={`${id}-option`} value={`${level}`} label={displayName}/>
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
