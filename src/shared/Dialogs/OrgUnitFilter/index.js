import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
} from '@dhis2/ui';
import React, {useState} from 'react';
import OrgUnitDimension from "./Components/OrgUnitDimension";
import _ from 'lodash';
import {useAlert} from "@dhis2/app-runtime";
import PlanningOrgUnitLevelState from "../../../core/states/orgUnit";
import {useRecoilValue} from "recoil";
import i18n from '@dhis2/d2-i18n'
export default function OrganisationUnitFilter({onClose, onUpdate, initialOrgUnit}) {
    const [selectedOrgUnitPaths, setSelectedOrgUnitPaths] = useState(initialOrgUnit && [initialOrgUnit?.path]);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState(initialOrgUnit ? [initialOrgUnit] : []);
    const orgUnitLevel = useRecoilValue(PlanningOrgUnitLevelState);
    const onSelect = ({path}) => {
        setSelectedOrgUnitPaths([path])
    };
    const onDeselect = ({path}) => setSelectedOrgUnitPaths(_.difference(selectedOrgUnitPaths, [path]))
    const onUpdateOrgUnit = (orgUnit) => setSelectedOrgUnit(orgUnit);
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    return (
        <Modal onClose={onClose} dataTest='orgUnit-filter'>
            <ModalTitle>
                {i18n.t('Organisation Units')}
            </ModalTitle>
            <ModalContent>
                <>
                    <p><b>{i18n.t('Planning Organisation Unit Level')}:</b> {i18n.t('{{ displayName }}', {displayName: orgUnitLevel?.displayName})}</p>
                    <OrgUnitDimension
                        selectedOrgUnitPaths={selectedOrgUnitPaths}
                        onSelect={onSelect}
                        onDeselect={onDeselect}
                        onUpdate={onUpdateOrgUnit}
                    /></>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        {
                            i18n.t('Hide')
                        }
                    </Button>
                    <Button primary onClick={() => {
                        if (onUpdate) {
                            if (!_.isEmpty(selectedOrgUnit)) {
                                onUpdate(selectedOrgUnit);
                            } else {
                                show({message: i18n.t('Please select an organisation unit')})
                            }
                        } else {
                            onClose()
                        }
                    }}>
                        {
                            i18n.t('Update')
                        }
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
