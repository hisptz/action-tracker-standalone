import { useSetRecoilState, useRecoilValue } from 'recoil';
import { DimensionsState } from '../states';
import { IndicatorsSelectedState } from '../states';
import { useDataQuery, useConfig, useDataEngine } from '@dhis2/app-runtime';
import { useEffect } from 'react';
import { IndicatorProgressState } from '../states';
import { Period } from '@iapps/period-utilities';
import { map, flattenDeep } from 'lodash';
import { formatAnalytics } from '../helpers/analyticsManipulation';


function joinPeriodsArray(periods) {
  let isoPeriods = [];
  const periodInstance = new Period();
  for (const period of periods) {
    const { quarterly } = periodInstance.getById(period?.id);
    const isoQuarterlyPeriods = flattenDeep(
      map(quarterly || [], (quarter) => {
        return quarter && quarter.id ? quarter.id : [];
      })
    );
    isoPeriods = [...isoQuarterlyPeriods];
  }

  return isoPeriods && isoPeriods.length ? isoPeriods.join(';') : '';
}

const indicatorProgressQuery = ({ indicatorId, period, ou }) => {
  return {
    data: {
      resource: `analytics?dimension=dx:${indicatorId}&dimension=pe:${joinPeriodsArray(
        period
      )}&filter=ou:${ou}&displayProperty=NAME&skipMeta=false&includeNumDen=true`,
    },
  };
};

export default function useIndicatorProgress({indicatorId, hasQuarterly}) {
   
  const { orgUnit, period } = useRecoilValue(DimensionsState) || {};

  const setIndicatorProgress = useSetRecoilState(IndicatorProgressState);

  const { loading, data, error } = useDataQuery(
    indicatorProgressQuery({ indicatorId, period, ou: orgUnit?.id }),
    {
      variables: {
        ou: orgUnit?.id,
        periods: period,
        indicator: indicatorId,
      },
    }
  );
 

  useEffect(() => {
    async function setIndicatorsSelectedData() {
      if (!loading && data && !error) {
        const responseData = data.data ? data.data : {};
        const formattedData = formatAnalytics(responseData);
        setIndicatorProgress(formattedData);
      }
    }

    setIndicatorsSelectedData();
  }, [loading]);

  return { loading, error, hasQuarterly };
}
