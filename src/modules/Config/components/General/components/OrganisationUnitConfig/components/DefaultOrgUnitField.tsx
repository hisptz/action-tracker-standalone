import i18n from '@dhis2/d2-i18n'
import { RHFDHIS2FormField } from '@hisptz/dhis2-ui'
import React from 'react'
import { useWatch } from 'react-hook-form'
import { useOrgUnitLevels } from '../../../../../../../shared/hooks/orgUnit'
import { compact } from 'lodash'

export function DefaultOrgUnitField () {
    const namespace = `general.orgUnit`
    const name = `${namespace}.defaultOrgUnit`
    const levelLimit = useWatch({
        name: `${namespace}.planning`
    })
    const {
        levels,
        loading
    } = useOrgUnitLevels(levelLimit?.levels)

    return (
        <div id="org-unit-default-config-field-container">
            <RHFDHIS2FormField
                disabled={loading}
                orgUnitProps={{
                    limitSelectionToLevels: levelLimit?.enabled ? compact(levels?.map(({ level }) => level)) : undefined
                }}
                label={i18n.t('Default planning organisation unit')}
                valueType="ORGANISATION_UNIT"
                name={name}
            />
        </div>
    )
}
