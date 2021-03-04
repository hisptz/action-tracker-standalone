import {Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip, Box} from '@dhis2/ui';
import React, {useState} from 'react';
import OrgUnitDimension from "./Components/OrgUnitDimension";
import _ from 'lodash';

export default function OrganisationUnitFilter({onClose, onUpdate}) {
    const [selectedOrgUnits, setSelectedOrgUnits] = useState([]);

    const onSelect = ({path}) => setSelectedOrgUnits([...selectedOrgUnits, path]);
    const onDeselect = ({path}) => setSelectedOrgUnits(_.difference(selectedOrgUnits, [path]))


    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                Organisation Units
            </ModalTitle>
            <ModalContent>
                <OrgUnitDimension
                    selectedOrgUnits={selectedOrgUnits}
                    onSelect={onSelect}
                    onDeselect={onDeselect}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        Hide
                    </Button>
                    <Button primary onClick={onUpdate || onClose}>
                        Update
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
