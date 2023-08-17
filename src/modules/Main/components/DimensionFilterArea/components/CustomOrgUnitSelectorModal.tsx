import { Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle } from '@dhis2/ui'
import i18n from '@dhis2/d2-i18n'
import React, { useMemo, useState } from 'react'
import { useConfiguration } from '../../../../../shared/hooks/config'
import { OrgUnitSelector } from '@hisptz/dhis2-ui'
import { compact, last } from 'lodash'
import { useOrgUnit, useOrgUnitLevels } from '../../../../../shared/hooks/orgUnit'
import { useDimensions } from '../../../../../shared/hooks'
import { DimensionSelection } from './DimensionSelection'
import { useBoolean } from 'usehooks-ts'
import { OrganisationUnit } from '@hisptz/dhis2-utils'

export interface CustomOrgUnitSelectorModalProps {
    hide: boolean;
    onClose: () => void;
    onSelect: (orgUnit: string) => void,
    selected?: OrganisationUnit
}

export function CustomOrgUnitSelectorModal ({ hide, selected, onSelect, onClose }: CustomOrgUnitSelectorModalProps) {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState<OrganisationUnit | undefined>(selected)
    const { config } = useConfiguration()
    const planningOrgUnit = useMemo(() => config?.general.orgUnit.planning.levels, [config])
    const planningLimitEnabled = config?.general.orgUnit.planning.enabled
    const { loading: levelLoading, levels } = useOrgUnitLevels(planningOrgUnit)

    const onUpdate = () => {
        if (selectedOrgUnits) {
            onSelect(selectedOrgUnits?.id)
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
                    {
                        !planningLimitEnabled ? <></> :
                            <span>{i18n.t('Planning level')}<b>{`: ${levelLoading ? '...' : levels?.map(({ displayName }) => displayName).join(', ') ?? ''}`}</b></span>
                    }
                    <OrgUnitSelector
                        limitSelectionToLevels={planningLimitEnabled ? compact(levels?.map(({ level }) => level)) : undefined}
                        singleSelection
                        value={{
                            orgUnits: compact([
                                selectedOrgUnits
                            ])
                        }}
                        searchable
                        onUpdate={(value) => {
                            setSelectedOrgUnits(last(value.orgUnits))
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

export function OrgUnitDimensionSelection () {
    const { orgUnit, setOrgUnit } = useDimensions()
    const { loading, orgUnit: orgUnitWithData } = useOrgUnit(orgUnit?.id)

    const {
        value: orgUnitHidden,
        setTrue: hideOrgUnit,
        setFalse: showOrgUnit
    } = useBoolean(true)

    return (<>
        {
            loading ? null : <CustomOrgUnitSelectorModal
                selected={orgUnitWithData}
                onClose={hideOrgUnit}
                hide={orgUnitHidden}
                onSelect={setOrgUnit}
            />
        }
        <DimensionSelection
            loading={loading}
            onClick={() => {
                showOrgUnit()
            }}
            selectedItems={compact([orgUnitWithData])}
            title={i18n.t('Select organisation unit')}
        />

    </>)
}
