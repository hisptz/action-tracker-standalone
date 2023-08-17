import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React, { useState } from 'react'
import { useConfiguration } from '../../../../../shared/hooks/config'
import { PeriodSelector } from '@hisptz/dhis2-ui'
import { compact, head } from 'lodash'
import { FixedPeriodType, PeriodTypeCategory, PeriodUtility } from '@hisptz/dhis2-utils'

export interface CustomPeriodSelectorModalProps {
    hide: boolean;
    onClose: () => void;
    onSelect: (period: string) => void,
    selected?: string
}

export function CustomPeriodSelectorModal ({ hide, selected, onSelect, onClose }: CustomPeriodSelectorModalProps) {
    const [selectedPeriods, setSelectedPeriods] = useState<string | undefined>(selected)
    const { config } = useConfiguration()
    const planningPeriodType = config?.general.period.planning
    const fixedPeriodTypes = new PeriodUtility().setCategory(PeriodTypeCategory.FIXED).periodTypes
    const planningPeriod = fixedPeriodTypes.find(({ id }) => planningPeriodType === id) as FixedPeriodType
    const excludedPeriodTypes = fixedPeriodTypes.filter((type) => type.id !== planningPeriodType)?.map(({ id }) => id)
    const onUpdate = () => {
        if (selectedPeriods) {
            onSelect(selectedPeriods)
            onClose()
        }
    }

    return (
        <Modal position="middle" hide={hide} onClose={onClose}>
            <ModalTitle>
                {i18n.t('Select period')}
            </ModalTitle>
            <ModalContent>
                <div className="column gap-16">
                    <span>{i18n.t('Planning period is')}<b>{` ${planningPeriod.config.name}`}</b></span>
                    <PeriodSelector
                        enablePeriodSelector
                        excludeRelativePeriods
                        excludedPeriodTypes={excludedPeriodTypes}
                        defaultInputType="period"
                        singleSelection
                        selectedPeriods={compact([selectedPeriods])}
                        onSelect={({ items }) => {
                            const value = head(items)
                            if (typeof value === 'string') {
                                setSelectedPeriods(value)
                            }
                        }}
                    />
                </div>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button onClick={onClose}>
                        {i18n.t('Cancel')}
                    </Button>
                    <Button primary onClick={onUpdate}>
                        {i18n.t('Update')}
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
