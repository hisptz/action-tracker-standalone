import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { RHFDHIS2FormField } from '@hisptz/dhis2-ui'
import { OrgUnitPlanning } from './components/OrgUnitPlanning'
import { OrganisationUnitSelection } from './components/OrganisationUnitSelection'

export function OrganisationUnitConfig () {
    const namespace = `general.orgUnit`

    return (
        <div className="column gap-8">
            <span>{i18n.t('Access')}</span>
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
