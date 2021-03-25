import LineChart from '../Charts/LineChart';
import {map} from 'lodash'

function ProgressChart({ periods, indicatorsDataList }) {
    const formattedIndicators = map(indicatorsDataList || [], indicator => {
        return indicator && parseFloat(indicator) ? parseFloat(indicator) : 0;
    }).reverse();
    const formattedPeriods = periods.reverse();
  return (
    <div style={{width: '100%', height: '100%'}}>
      <LineChart
        title="Progress chart"
        yAxisData={formattedIndicators}
        xAxisData={formattedPeriods}
        yAxisTitle="Indicators"
        xAxisTitle="Period"
      />
    </div>
  );
}

export default ProgressChart;
