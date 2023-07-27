import React from 'react'
import { Card } from '@dhis2/ui'
import { DimensionSelection } from './components/DimensionSelection'
import i18n from '@dhis2/d2-i18n'
import classes from './DimensionFilterArea.module.css'
import { useDimensions } from '../../../../shared/hooks'
import { useBoolean } from 'usehooks-ts'
import { compact, head } from 'lodash'
import { OrgUnitSelectorModal, PeriodSelectorModal } from '@hisptz/dhis2-ui'
import { type OrgUnitSelection } from '@hisptz/dhis2-utils'
import { ConfigureButton } from '../ConfigureButton'
import { useOrgUnit } from '../../../../shared/hooks/orgUnit'

export function DimensionFilterArea () {
    const {
        orgUnit,
        setOrgUnit,
        period,
        setPeriod
    } = useDimensions()
    const {
        value: orgUnitHidden,
        setTrue: hideOrgUnit,
        setFalse: showOrgUnit
    } = useBoolean(true)
    const {
        value: periodHidden,
        setTrue: hidePeriod,
        setFalse: showPeriod
    } = useBoolean(true)

    const {loading, orgUnit: orgUnitWithData} = useOrgUnit(orgUnit?.id)

    return (
        <div className={classes['selection-card']}>
            <Card>
                <div className="row space-between align-center ph-16">
                    <div className="row align-items-center">
                        {
                            orgUnitHidden && !loading
                                ? null
                                : <OrgUnitSelectorModal
                                    position="middle"
                                    singleSelection
                                    value={{
                                        orgUnits: compact([
                                            orgUnitWithData
                                        ])
                                    }}
                                    onClose={hideOrgUnit}
                                    hide={orgUnitHidden}
                                    onUpdate={({ orgUnits }: OrgUnitSelection) => {
                                        const value = head(orgUnits)?.id
                                        if (value) {
                                            setOrgUnit(value)
                                            hideOrgUnit()
                                        }
                                    }}
                                />
                        }
                        <DimensionSelection
                            loading={loading}
                            onClick={() => {
                                if (!loading) {
                                    showOrgUnit()
                                }
                            }}
                            selectedItems={compact([orgUnitWithData])}
                            title={i18n.t('Select organisation unit')}
                        />
                        <PeriodSelectorModal
                            singleSelection
                            enablePeriodSelector
                            position="middle"
                            selectedPeriods={compact([period?.id])}
                            onClose={hidePeriod}
                            hide={periodHidden} onUpdate={(periods) => {
                            const value = head(periods)
                            if (value) {
                                if (typeof value === 'string') {
                                    setPeriod(value)
                                    hidePeriod()
                                }
                            }
                        }}/>
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
