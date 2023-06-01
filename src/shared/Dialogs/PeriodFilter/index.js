import {AlertBar, Button, ButtonStrip, Modal, ModalActions, ModalContent, ModalTitle,} from '@dhis2/ui';
import React, {useMemo, useState} from 'react';
import {useSetting} from "@dhis2/app-service-datastore";
import * as _ from "lodash";
import {useAlert} from "@dhis2/app-runtime";
import DataStoreConstants from "../../../core/constants/datastore";
import i18n from '@dhis2/d2-i18n'
import {PeriodSelector} from "@hisptz/dhis2-ui";
import {PeriodTypeCategory, PeriodUtility} from "@hisptz/dhis2-utils";

export default function PeriodFilter({onClose, onUpdate, initialPeriods}) {
    const [selectedPeriods, setSelectedPeriods] = useState(initialPeriods ? [initialPeriods.id] : []);
    const [error, setError] = useState();
    const [planningPeriod] = useSetting(DataStoreConstants.PLANNING_PERIOD_KEY, {global: true})
    const {show} = useAlert(({message}) => message, ({type}) => ({duration: 3000, ...type}))
    // useEffect(() => generateErrorAlert(show, error), [error])
    const excludePeriodTypes = useMemo(() => {
        const periodUtility = new PeriodUtility();
        periodUtility.setYear(new Date().getFullYear());
        periodUtility.setCategory(PeriodTypeCategory.FIXED);
        const periodsTypes = periodUtility.periodTypes;
        return _.filter(periodsTypes, ({id}) => (id.toLowerCase() !== planningPeriod.toLowerCase()))?.map(({id}) => id)
    }, [planningPeriod]);
    const styles = {
        errorText: {
            fontSize: 12,
            color: 'red',
            backGroundColor: 'red'
        }
    }

    console.log(excludePeriodTypes)

    const onUpdateClick = () => {
        if (!_.isEmpty(selectedPeriods)) {
            const periodObject = PeriodUtility.getPeriodById(_.head(selectedPeriods));
            if (periodObject?.type.id.toLowerCase() === planningPeriod.toLowerCase()) {
                if (onUpdate) {
                    console.log("Updating")
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
        <Modal position={'middle'} hide={!open} onClose={onClose} dataTest='period-filter'>
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
                <PeriodSelector
                    excludedPeriodTypes={excludePeriodTypes.filter((id) => id !== 'DAILY')}
                    enablePeriodSelector
                    excludeRelativePeriods
                    singleSelection
                    selectedPeriods={[...selectedPeriods]}
                    onSelect={({items}) => setSelectedPeriods(items)}
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
