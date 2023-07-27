import React, { useMemo, useState } from 'react'
import i18n from '@dhis2/d2-i18n'
import { OrgUnitSelector, RHFCheckboxField, RHFDHIS2FormField, RHFSingleSelectField } from '@hisptz/dhis2-ui'
import { useController, useWatch } from 'react-hook-form'
import { useDataQuery } from '@dhis2/app-runtime'
import { Button, ButtonStrip, Field, MultiSelectField, MultiSelectOption } from '@dhis2/ui'
import { uniqBy } from 'lodash'

const query = {
    levels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: ['id', 'level', 'displayName'],
            paging: false
        }
    }
}

function OrgUnitPlanning () {
    const {
        data,
        loading
    } = useDataQuery<{
        levels: { organisationUnitLevels: Array<{ id: string, level: number, displayName: string }> }
    }>(query, {})
    const namespace = `general.orgUnit.planning`
    const [enabled] = useWatch({
        name: [`${namespace}.enabled`]
    })

    const options = useMemo(() => {
        if (loading) return []
        return data?.levels?.organisationUnitLevels.map(level => ({
            label: `${level.displayName} (${level.level})`,
            value: level.id
        })) ?? []
    }, [loading, data])

    return (
        <>
            <RHFCheckboxField label={i18n.t('Limit planning of actions to specific organisation unit levels')}
                              name={`${namespace}.enabled`}/>
            {
                enabled && (
                    <RHFSingleSelectField
                        loading={loading}
                        required
                        disabled={!enabled}
                        label={i18n.t('Planning organisation unit level')}
                        options={options}
                        name={`${namespace}.levels`}
                    />
                )
            }
        </>
    )
}

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

function OrgUnitLevelSelector ({ field }: {
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
        <div className="row gap-8 align-end">
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

export function OrganisationUnitSelection () {
    const namespace = `general.orgUnit`
    const { field } = useController({
        name: `${namespace}.orgUnits`
    })

    const accessAll = useWatch({
        name: `${namespace}.accessAll`
    })

    return (
        <Field helpText={i18n.t("{{count}} organisation unit selected", {count: field.value?.length ?? 0})} label={i18n.t('Organisation units')}>
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
                    <OrgUnitLevelSelector field={field}/>
                </div>
            </div>
        </Field>
    )
}

export function OrganisationUnitConfig () {
    const namespace = `general.orgUnit`

    return (
        <div className="column gap-8">
            <span>{i18n.t('Access')}</span>
            <RHFCheckboxField
                label={i18n.t('Allow access to all organisation units')}
                name={`${namespace}.accessAll`}
            />
            <OrganisationUnitSelection/>
            <span>{i18n.t('Planning')}</span>
            <OrgUnitPlanning/>
            <RHFDHIS2FormField
                label={i18n.t('Default organisation unit')}
                valueType="ORGANISATION_UNIT"
                name={`${namespace}.defaultOrgUnit`}
            />
        </div>
    )
}
