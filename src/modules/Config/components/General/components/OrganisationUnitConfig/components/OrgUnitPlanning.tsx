import { useDataQuery } from '@dhis2/app-runtime'
import { useWatch } from 'react-hook-form'
import React, { useMemo } from 'react'
import { RHFCheckboxField, RHFSingleSelectField } from '@hisptz/dhis2-ui'
import i18n from '@dhis2/d2-i18n'

const query = {
    levels: {
        resource: 'organisationUnitLevels',
        params: {
            fields: ['id', 'level', 'displayName'],
            paging: false
        }
    }
}

export function OrgUnitPlanning () {
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
                        name={`${namespace}.levels.0`}
                    />
                )
            }
        </>
    )
}
