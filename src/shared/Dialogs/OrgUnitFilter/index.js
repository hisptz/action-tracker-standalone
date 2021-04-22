import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    CenteredContent,
    CircularLoader
} from '@dhis2/ui';
import React, {useState} from 'react';
import OrgUnitDimension from "./Components/OrgUnitDimension";
import _ from 'lodash';
import {useDataStore} from "@dhis2/app-service-datastore";
import useOrganisationUnit, {useOrganisationUnitLevel} from "../../../core/hooks/organisationUnit";
import DataStoreConstants from "../../../core/constants/datastore";

export default function OrganisationUnitFilter({onClose, onUpdate, initialOrgUnit}) {
    const [selectedOrgUnitPaths, setSelectedOrgUnitPaths] = useState(initialOrgUnit && [initialOrgUnit?.path]);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState([initialOrgUnit]);
    const {globalSettings} = useDataStore();
    const settings = globalSettings?.settings || {};
    const planningOrgUnitLevel = settings[DataStoreConstants.PLANNING_ORG_UNIT_KEY]
    const {orgUnitLevel, loading} = useOrganisationUnitLevel(planningOrgUnitLevel);
    const onSelect = ({path}) => setSelectedOrgUnitPaths([path]);
    const onDeselect = ({path}) => setSelectedOrgUnitPaths(_.difference(selectedOrgUnitPaths, [path]))
    const onUpdateOrgUnit = (orgUnit) => setSelectedOrgUnit(orgUnit);
    console.log(orgUnitLevel);
    return (
        <Modal onClose={onClose}>
            <ModalTitle>
                Organisation Units
            </ModalTitle>
            <ModalContent>
                {
                    loading ?
                        <div style={{height: 300}}><CenteredContent><CircularLoader small/></CenteredContent></div> :
                        <>
                            <p><b>Planning Organisation Unit Level:</b> {orgUnitLevel?.displayName}</p>
                            <OrgUnitDimension
                                selectedOrgUnitPaths={selectedOrgUnitPaths}
                                onSelect={onSelect}
                                onDeselect={onDeselect}
                                onUpdate={onUpdateOrgUnit}
                            /></>
                }
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        Hide
                    </Button>
                    <Button primary onClick={() => {
                        if (onUpdate) {
                            onUpdate(selectedOrgUnit);
                        } else {
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
