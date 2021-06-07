import {map} from 'lodash'
import React, {Suspense} from 'react'
import FullPageLoader from "../FullPageLoader";

const LineChart = React.lazy(()=>import('../Charts/LineChart'))


function ProgressChart({ periods, indicatorsDataList }) {
    const formattedIndicators = map(indicatorsDataList || [], indicator => {
        return indicator && parseFloat(indicator) ? parseFloat(indicator) : 0;
    }).reverse();
    const formattedPeriods = periods.reverse();
  return (
    <div style={{width: '100%', height: '100%'}}>
      <Suspense fallback={<FullPageLoader/>}>
          <LineChart
              title="Progress chart"
              yAxisData={formattedIndicators}
              xAxisData={formattedPeriods}
              yAxisTitle="Indicators"
              xAxisTitle="Period"
          />
      </Suspense>
    </div>
  );
}

export default ProgressChart;
