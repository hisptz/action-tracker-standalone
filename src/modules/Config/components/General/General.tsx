import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Divider } from '@dhis2/ui'
import { OrganisationUnitConfig } from './components/OrganisationUnitConfig'
import { PeriodConfig } from './components/PeriodConfig'
import { GeneralSteps, PeriodSteps } from './docs/steps'
import { HelpButton, HelpIcon } from '../../../../shared/components/HelpButton'
import { DeleteConfig } from './components/DeleteConfig'

export function General () {

    return (
        <div className="column gap-32">
            <div>
                <div className="row space-between gap-16">
                    <h2 className="m-0">{i18n.t('General configuration')}</h2>
                    <HelpButton steps={GeneralSteps} key="general-config"/>
                </div>
                <Divider margin="0"/>
            </div>
            <div style={{ maxWidth: 800 }} className="column gap-32">
                <div className="gap-16 column">
                    <h3 className="m-0">{i18n.t('Organisation Units')}</h3>
                    <OrganisationUnitConfig/>
                    <div className="row gap-8 align-center">
                        <h3 className="m-0">{i18n.t('Period')}</h3>
                        <HelpIcon steps={PeriodSteps} key="period-config-steps"/>
                    </div>
                    <PeriodConfig/>
                </div>
                <div className="row gap-8 align-center">
                    <h3 className="m-0">{i18n.t('Configuration Management')}</h3>
                </div>
                <div>
                    <DeleteConfig/>
                </div>
            </div>
        </div>
    )
}
