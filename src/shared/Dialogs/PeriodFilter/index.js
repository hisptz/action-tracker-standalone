import {AlertBar, Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle,} from '@dhis2/ui';
import React, {useState} from 'react';
import {PeriodDimension} from '@dhis2/analytics';
import {Period} from "@iapps/period-utilities";
import {useSetting} from "@dhis2/app-service-datastore";
import * as _ from "lodash";
import {useAlert} from "@dhis2/app-runtime";
import DataStoreConstants from "../../../core/constants/datastore";
import i18n from '@dhis2/d2-i18n'

export default function PeriodFilter({onClose, onUpdate, initialPeriods}) {
    const [selectedPeriods, setSelectedPeriods] = useState(initialPeriods && [initialPeriods]);
    const [error, setError] = useState();
    const periodInstance = new Period();
    periodInstance.setPreferences({allowFuturePeriods: true});
    const [planningPeriod] = useSetting(DataStoreConstants.PLANNING_PERIOD_KEY, {global: true})
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    // useEffect(() => generateErrorAlert(show, error), [error])

    const styles = {
        errorText: {
            fontSize: 12,
            color: 'red',
            backGroundColor: 'red'
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
        <Modal position={'middle'} open={open} onClose={onClose} dataTest='period-filter'>
            <ModalTitle>
                {
                    i18n.t('Period')
                }
            </ModalTitle>
            <ModalContent>
                <p><b>{i18n.t('Planning Period')}: </b> {i18n.t('{{ planningPeriod }} ', {planningPeriod})}</p>
                {error &&

                <AlertBar backGroundColor={'red'} color={'blue'} duration={2000}>
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
