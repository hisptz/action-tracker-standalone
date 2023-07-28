import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Divider } from '@dhis2/ui'
import { OrganisationUnitConfig } from './components/OrganisationUnitConfig'
import { PeriodConfig } from './components/PeriodConfig'
import { Sharing } from './components/Sharing'

export function General() {
    return (
        <div className="column gap-32">
            <div>
                <h2 className="m-0">{i18n.t("General configuration")}</h2>
                <Divider margin="0"/>
            </div>
            <div style={{maxWidth: 800}} className="column gap-32">
                <div className="gap-16 column">
                    <h3 className="m-0">{i18n.t("Organisation Units")}</h3>
                    <OrganisationUnitConfig/>
                    <h3 className="m-0">{i18n.t("Period")}</h3>
                    <PeriodConfig/>
                    <h3 className="m-0" >{i18n.t("Sharing")}</h3>
                    <Sharing/>
                </div>
            </div>
        </div>
    )
}
