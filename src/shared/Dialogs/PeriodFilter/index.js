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
import {useDataStore, useSetting} from "@dhis2/app-service-datastore";
import * as _ from "lodash";
import DataStoreConstants from "../../../core/constants/datastore";
import i18n from '@dhis2/d2-i18n'
import { AlertBar } from '@dhis2/ui'

export default function PeriodFilter({onClose, onUpdate, initialPeriods}) {
    const [selectedPeriods, setSelectedPeriods] = useState(initialPeriods && [initialPeriods]);
    const [error, setError] = useState();
    const periodInstance = new Period();
    periodInstance.setPreferences({allowFuturePeriods: true});
    const [planningPeriod] = useSetting(DataStoreConstants.PLANNING_PERIOD_KEY, {global: true})

    const styles = {
        errorText: {
            fontSize: 12,
            color: 'red',
            'backGroundColor':'red'
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
                setError(i18n.t(`Invalid Period. Please select period of type  {{ planningPeriod }}.`, {planningPeriod}));
                setSelectedPeriods([]);
            }
        } else {
            show({message: i18n.t('Please select a period.')})
        }
    }

    return (
        <Modal open={open} onClose={onClose} dataTest='period-filter'>
            <ModalTitle>
                {
                    i18n.t('Period')
                }
            </ModalTitle>
            <ModalContent>
                <p><b>{i18n.t('Planning Period')}: </b> {i18n.t('{{ planningPeriod }} ', {planningPeriod})}</p>
                {error && 
                      
                <AlertBar  style={styles.errorText} duration ={2000}  >
        {i18n.t('{{ error }}', {error})}
        </AlertBar>
  
            }
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
                        {
                            i18n.t('Hide')
                        }
                    </Button>
                    <Button
                        primary
                        onClick={(_) => {
                            onUpdateClick();
                        }}
                    >
                        {
                            i18n.t('Update')
                        }
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}
