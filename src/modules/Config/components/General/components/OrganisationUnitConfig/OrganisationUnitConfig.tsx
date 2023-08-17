import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { OrgUnitPlanning } from './components/OrgUnitPlanning'
import { OrganisationUnitSelection } from './components/OrganisationUnitSelection'
import { DefaultOrgUnitField } from './components/DefaultOrgUnitField'

export function OrganisationUnitConfig () {

    return (
        <div className="column gap-8">
            <span>{i18n.t('Access')}</span>
            <OrganisationUnitSelection/>
            <span>{i18n.t('Planning')}</span>
            <OrgUnitPlanning/>
            <DefaultOrgUnitField/>
        </div>
    )
}
