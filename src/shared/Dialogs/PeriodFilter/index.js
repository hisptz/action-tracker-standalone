import {
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    ModalTitle,
} from '@dhis2/ui';
import React, {useState} from 'react';
import {PeriodDimension} from '@dhis2/analytics';
import {Period} from "@iapps/period-utilities";

export default function PeriodFilter({onClose, onUpdate, initialPeriods}) {
    const [selectedPeriods, setSelectedPeriods] = useState(initialPeriods);
    const periodInstance = new Period();


    return (
        <Modal open={open} onClose={onClose}>
            <ModalTitle>Period</ModalTitle>
            <ModalContent>
                <PeriodDimension
                    onSelect={(period) => {
                        const items = period && period.items ? period.items : [];
                        if (items && items.length && items.length > 1) {
                            items.shift();
                        }
                       console.log( periodInstance.getById(items.shift()?.id))
                        setSelectedPeriods([{...period, items}]);
                    }}
                    selectedPeriods={selectedPeriods}
                />
            </ModalContent>
            <ModalActions>
                <ButtonStrip>
                    <Button secondary onClick={onClose}>
                        Hide
                    </Button>
                    <Button
                        primary
                        onClick={(_) => {
                            if (onUpdate) {
                                onUpdate(selectedPeriods);
                            } else {
                                onClose();
                            }
                        }}
                    >
                        Update
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
