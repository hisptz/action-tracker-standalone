import {
    Modal,
    ModalTitle,
    ModalContent,
    ModalActions,
    Button,
    ButtonStrip,
    CircularLoader,
    CenteredContent,
} from '@dhis2/ui';
import {useState} from 'react';
import ProgressChart from '../../Components/ProgressChart';
import useIndicatorProgress from '../../../core/hooks/indicatorProgress';
import {useRecoilValue} from 'recoil';
import {IndicatorProgressState, DimensionsState} from '../../../core/states';
import {map, flattenDeep, find} from 'lodash';
import {Period} from '@iapps/period-utilities';
import './style/progressDialog.css';
import {useDataStore} from "@dhis2/app-service-datastore";
import DataStoreConstants from "../../../core/constants/datastore";

function getQuarterlyPeriods(periods) {
    let quarterlyPeriods = [];
    if (periods && periods.length) {
        for (const period of periods) {
            const {quarterly} = period;
            const isoQuarterlyPeriods = flattenDeep(
                map(quarterly || [], (quarter) => {
                    return quarter ? quarter : [];
                })
            );
            quarterlyPeriods = [...isoQuarterlyPeriods];
        }
    }
    return quarterlyPeriods;
}

function ProgressDialog({onClose, indicatorId, selectedPeriod}) {
    const {period} = useRecoilValue(DimensionsState) || {};
    const {globalSettings} = useDataStore();
    const trackingPeriod = globalSettings.settings[DataStoreConstants.TRACKING_PERIOD_KEY];
    const quarterlyPeriods = period[trackingPeriod.toLowerCase()];
    const indicatorProgressStatus = useIndicatorProgress({indicatorId})
    const indicatorProgressData = useRecoilValue(IndicatorProgressState);

    let indicators = [];

    const periodNames = map(quarterlyPeriods || [], (quarterlyPeriod) => {
        const indicatorObj = find(
            indicatorProgressData || [],
            (indicatorProgressItem) =>
                indicatorProgressItem?.period === quarterlyPeriod.id
        );
        indicators =
            indicatorObj && indicatorObj.value
                ? [...indicators, indicatorObj.value]
                : [...indicators, 0];
        return quarterlyPeriod && quarterlyPeriod.name ? quarterlyPeriod.name : '';
    });
    return (
        <Modal className="progress-dialog-container" onClose={onClose} large>
            <ModalContent>
                {!indicatorProgressStatus?.loading &&
                !indicatorProgressStatus?.error &&
                !_.isEmpty(quarterlyPeriods) && (
                    <ProgressChart
                        periods={periodNames}
                        indicatorsDataList={indicators}
                    />
                )}
                {indicatorProgressStatus?.loading &&
                _.isEmpty(quarterlyPeriods) &&
                (
                    <CenteredContent>
                        <CircularLoader large/>
                    </CenteredContent>
                )}
                {
                    _.isEmpty(quarterlyPeriods) && (
                        <CenteredContent>
                            <h3 style={{color: 'gray'}}><i>Selected period has no quarters </i></h3>
                        </CenteredContent>
                    )}
            </ModalContent>
            <ModalActions>
                <ButtonStrip end>
                    <Button secondary onClick={onClose}>
                        Hide
                    </Button>
                </ButtonStrip>
            </ModalActions>
        </Modal>
    );
}

export default ProgressDialog;
