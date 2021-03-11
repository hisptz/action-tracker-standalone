import {
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    ModalTitle,
} from '@dhis2/ui';
import React, {useState} from 'react';
import {PeriodDimension, DIMENSION_ID_PERIOD} from '@dhis2/analytics';
// import {Fn} from '@iapps/function-analytics';

export default function PeriodFilter({onClose, onUpdate}) {
    // const periodInstance = new Fn.Period();
    const [selectedPeriods, setSelectedPeriods] = useState([]);

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
