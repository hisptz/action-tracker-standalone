import React from 'react'
import { Card } from '@dhis2/ui'
import { DimensionSelection } from './components/DimensionSelection'
import i18n from '@dhis2/d2-i18n'
import classes from './DimensionFilterArea.module.css'
import { useDimensions } from '../../../../shared/hooks'
import { useBoolean } from 'usehooks-ts'
import { compact } from 'lodash'
import { ConfigureButton } from '../ConfigureButton'
import { CustomPeriodSelectorModal } from './components/CustomPeriodSelectorModal'
import { OrgUnitDimensionSelection } from './components/CustomOrgUnitSelectorModal'

export function DimensionFilterArea () {
    const {
        period,
        setPeriod
    } = useDimensions()
    const {
        value: periodHidden,
        setTrue: hidePeriod,
        setFalse: showPeriod
    } = useBoolean(true)

    return (
        <div className={classes['selection-card']}>
            <Card>
                <div className="row space-between align-center ph-16">
                    <div className="row align-items-center">
                        <OrgUnitDimensionSelection/>
                        <CustomPeriodSelectorModal
                            onClose={hidePeriod}
                            hide={periodHidden}
                            onSelect={setPeriod}
                            selected={period?.id}
                        />
                        <DimensionSelection
                            onClick={showPeriod}
                            selectedItems={compact([period])}
                            title={i18n.t('Select period')}
                        />
                    </div>
                    <ConfigureButton/>
                </div>
            </Card>
        </div>
    )
}
