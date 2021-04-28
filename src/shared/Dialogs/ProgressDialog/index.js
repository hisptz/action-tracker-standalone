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
import { useState } from 'react';
import ProgressChart from '../../Components/ProgressChart';
import useIndicatorProgress from '../../../core/hooks/indicatorProgress';
import { useRecoilValue } from 'recoil';
import { IndicatorProgressState, DimensionsState } from '../../../core/states';
import { map, flattenDeep, find } from 'lodash';
import { Period } from '@iapps/period-utilities';
import './style/progressDialog.css';

function getQuarteryPeriods(period) {
  let quarterlyPeriods = [];
  const periodInstance = new Period();
  if (period && period.length) {
    for (const periodItem of period) {
      const { quarterly } = periodInstance.getById(periodItem?.id);
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

function ProgressDialog({ onClose, indicatorId }) {
  const { period } = useRecoilValue(DimensionsState) || {};
  const [selectedPeriods, setSelectedPeriods] = useState([]);
  const quarteryPeriods = getQuarteryPeriods(period);
  const indicatorProgressStatus =
    quarteryPeriods && quarteryPeriods.length
      ? useIndicatorProgress({ indicatorId: indicatorId, hasQuarterly: true })
      : { hasQuarterly: false };
  const indicatorProgressData = useRecoilValue(IndicatorProgressState);

  let indicators = [];

  const periodNames = map(quarteryPeriods || [], (quarteryPeriod) => {
    const indicatorObj = find(
      indicatorProgressData || [],
      (indicatorProgressItem) =>
        indicatorProgressItem?.period === quarteryPeriod.id
    );
    indicators =
      indicatorObj && indicatorObj.value
        ? [...indicators, indicatorObj.value]
        : [...indicators, 0];
    return quarteryPeriod && quarteryPeriod.name ? quarteryPeriod.name : '';
  });
  return (
    <Modal className="progress-dialog-container" onClose={onClose} large>
      <ModalContent>
        {!indicatorProgressStatus?.loading &&
          !indicatorProgressStatus?.error &&
          indicatorProgressStatus?.hasQuarterly && (
            <ProgressChart
              periods={periodNames}
              indicatorsDataList={indicators}
            />
          )}
        {indicatorProgressStatus?.loading &&
        indicatorProgressStatus?.hasQuarterly &&
          (
            <CenteredContent>
              <CircularLoader large />
            </CenteredContent>
          )}
          {
          !indicatorProgressStatus?.hasQuarterly && (
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
