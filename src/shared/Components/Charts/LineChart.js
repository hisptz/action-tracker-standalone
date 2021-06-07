import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import {useConfig} from '@dhis2/app-runtime'

function LineChart({title, xAxisData, yAxisData, yAxisTitle}) {
    const {baseUrl} = useConfig()
    const chartData = {
        chart: {
            zoomType: 'xy'
        },
        credits: {
            enabled: false
        },
        title: {
            text: title,
            align: 'left',
            style: {
                fontWeight: 'bold',
            },
        },
        subtitle: {
            text: `Source: ${baseUrl}`,
            align: 'left',
        },
        xAxis: [
            {
                categories: xAxisData,
                crosshair: true,
            },
        ],
        yAxis: [
            {
                // Secondary yAxis
                gridLineWidth: 0,
                title: {
                    text: yAxisTitle,
                    style: {
                        color: Highcharts.getOptions().colors[0],
                    },
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[0],
                    },
                },
            }

        ],
        tooltip: {
            shared: true,
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor:
                Highcharts.defaultOptions.legend.backgroundColor || // theme
                'rgba(255,255,255,0.25)',
        },
        series: [

            {
                name: yAxisTitle,
                type: 'spline',
                data: yAxisData,
                tooltip: {
                    valueSuffix: ' ',
                },
            },
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 500,
                    },
                    chartOptions: {
                        legend: {
                            floating: false,
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom',
                            x: 0,
                            y: 0,
                        },
                        yAxis: [
                            {
                                labels: {
                                    align: 'right',
                                    x: 0,
                                    y: -6,
                                },
                                showLastLabel: true,
                            },
                            {
                                labels: {
                                    align: 'left',
                                    x: 0,
                                    y: -6,
                                },
                                showLastLabel: false,
                            },
                            {
                                visible: false,
                            },
                        ],
                    },
                },
            ],
        },
    }

    // setChartOptions(chartData);

    return (
        <div style={{width: '100%', height: '100%'}}>
            {chartData && <HighchartsReact
                containerProps={{style: {height: "100%", width: '100%'}}}
                highcharts={Highcharts}
                options={chartData}
            />}
            {
                !chartData && <p><i>There is no data for displaying progress chart</i></p>
            }
        </div>
    )
}

export default LineChart
