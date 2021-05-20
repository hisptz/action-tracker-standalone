import {
    Modal,
    ModalContent,
    ModalActions,
    ButtonStrip,
    Button,
    ModalTitle,
} from '@dhis2/ui';
import React, {useEffect, useState} from 'react';
import {PeriodDimension} from '@dhis2/analytics';
import {Period} from "@iapps/period-utilities";
import {useDataStore} from "@dhis2/app-service-datastore";
import _ from 'lodash';
import {useAlert} from "@dhis2/app-runtime";
import {generateErrorAlert} from "../../../core/services/errorHandling.service";
import DataStoreConstants from "../../../core/constants/datastore";

export default function PeriodFilter({onClose, onUpdate, initialPeriods}) {
    const [selectedPeriods, setSelectedPeriods] = useState(initialPeriods && [initialPeriods]);
    const [error, setError] = useState();
    const periodInstance = new Period();
    periodInstance.setPreferences({allowFuturePeriods: true});
    const {globalSettings} = useDataStore();
    const settings = globalSettings?.settings || {};
    const planningPeriod = settings[DataStoreConstants.PLANNING_PERIOD_KEY];
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    useEffect(() => generateErrorAlert(show, error), [error])

    const styles = {
        errorText: {
            fontSize: 12,
            color: 'red',
        }
    }

    const onUpdateClick = () => {
        if (!_.isEmpty(selectedPeriods)) {
            const periodObject = periodInstance.getById(_.head(selectedPeriods)?.id);
            if (periodObject?.type === planningPeriod) {
                if (onUpdate) {
                    onUpdate(periodObject);
                } else {
                    onClose();
                }
            } else {
                setError(`Invalid Period. Please select period of type ${planningPeriod}.`);
                setSelectedPeriods([]);
            }
        } else {
            show({message: 'Please select a period.', type: {critical: true}})
        }
    }

    return (
        <Modal open={open} onClose={onClose} dataTest='period-filter'>
            <ModalTitle>
                Period
            </ModalTitle>
            <ModalContent>
                <p><b>Planning Period:</b> {planningPeriod}</p>
                {error && <p style={styles.errorText}>{error}</p>}
                <PeriodDimension
                    onSelect={(period) => {
                        const items = period?.items || [];
                        if (items?.length && items.length > 1) {
                            items.shift();
                        }
                        setSelectedPeriods(items)
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
                            onUpdateClick();
                        }}
                    >
                        Update
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
