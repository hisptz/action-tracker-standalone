import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { OrgUnitPlanning } from './components/OrgUnitPlanning'
import { OrganisationUnitSelection } from './components/OrganisationUnitSelection'
import { DefaultOrgUnitField } from './components/DefaultOrgUnitField'
import { HelpIcon } from '../../../../../../shared/components/HelpButton'
import { OrgUnitAccessSteps, OrgUnitDefaultSteps, OrgUnitPlanningSteps } from '../../docs/steps'

export function OrganisationUnitConfig () {

    return (
        <div className="column gap-8">
            <div className="row gap-8 align-center">
                <span>{i18n.t('Access')}</span>
                <HelpIcon steps={OrgUnitAccessSteps} key="org-unit-access"/>
            </div>
            <OrganisationUnitSelection/>
            <div className="row gap-8 align-center">
                <span>{i18n.t('Planning')}</span>
                <HelpIcon steps={[...OrgUnitPlanningSteps, ...OrgUnitDefaultSteps]} key="org-unit-planning"/>
            </div>

            <OrgUnitPlanning/>
            <DefaultOrgUnitField/>
        </div>
    )
}
