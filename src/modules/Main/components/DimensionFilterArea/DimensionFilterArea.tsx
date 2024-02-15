import React from 'react'
import { Card } from '@dhis2/ui'
import classes from './DimensionFilterArea.module.css'
import { ConfigureButton } from '../ConfigureButton'
import { PeriodDimensionSelection } from './components/CustomPeriodSelectorModal'
import { OrgUnitDimensionSelection } from './components/CustomOrgUnitSelectorModal'

export function DimensionFilterArea () {

    return (
        <div className={classes['selection-card']}>
            <Card>
                <div className="row space-between align-center ph-16">
                    <div className="row align-items-center">
                        <OrgUnitDimensionSelection/>
                        <PeriodDimensionSelection/>
                    </div>
                    <ConfigureButton/>
                </div>
            </Card>
        </div>
    )
}
