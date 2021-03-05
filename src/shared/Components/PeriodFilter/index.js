import {Modal, ModalContent, ModalActions, ButtonStrip, Button, ModalTitle} from '@dhis2/ui'
import React, {useState} from 'react';
import {PeriodDimension, } from "@dhis2/analytics";


export default function PeriodFilter({onClose, onUpdate}) {
    const [selectedPeriods, setSelectedPeriods] = useState([]);


    return (
        <Modal open={open} onClose={onClose}>
            <ModalTitle>Period</ModalTitle>
            <ModalContent>
                <PeriodDimension  onSelect={(period) => setSelectedPeriods([period, ...selectedPeriods])}
                                 selectedPeriods={selectedPeriods}/>
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        Hide
                    </Button>
                    <Button primary onClick={_ => {
                        if (onUpdate) {
                            onUpdate(selectedPeriods);
                        } else {
                            onClose();
                        }
                    }}>
                        Update
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    )
}
