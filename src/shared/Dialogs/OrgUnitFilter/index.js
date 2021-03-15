import {Modal, ModalTitle, ModalContent, ModalActions, Button, ButtonStrip} from '@dhis2/ui';
import React, {useState} from 'react';
import OrgUnitDimension from "./Components/OrgUnitDimension";
import _ from 'lodash';

export default function OrganisationUnitFilter({onClose, onUpdate, initialOrgUnit}) {
    const [selectedOrgUnitPaths, setSelectedOrgUnitPaths] = useState(initialOrgUnit && [initialOrgUnit?.path]);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState([initialOrgUnit]);

    const onSelect = ({path}) => setSelectedOrgUnitPaths([path]);
    const onDeselect = ({path}) => setSelectedOrgUnitPaths(_.difference(selectedOrgUnitPaths, [path]))
    const onUpdateOrgUnit = (orgUnit) => setSelectedOrgUnit(orgUnit);

    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                Organisation Units
            </ModalTitle>
            <ModalContent>
                <OrgUnitDimension
                    selectedOrgUnitPaths={selectedOrgUnitPaths}
                    onSelect={onSelect}
                    onDeselect={onDeselect}
                    onUpdate={onUpdateOrgUnit}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        Hide
                    </Button>
                    <Button primary onClick={()=>{
                        if(onUpdate){
                          onUpdate(selectedOrgUnit);
                        } else{
                            onClose()
                        }
                    }}>
                        Update
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
