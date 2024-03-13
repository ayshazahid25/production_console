import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
// components
import Chart, { useChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

AppCurrentDownload.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
  workingReport: PropTypes.object,
};

export default function AppCurrentDownload({ title, subheader, chart, workingReport, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;
  // Extract today's working, remaining, and overtime duration from workingReport
  const todayWorkingTime = workingReport?.dailyReport?.totalWorkingDuration || {};
  const todayRemainingTime = workingReport?.dailyReport?.remainingTime || {};
  const todayOvertime = workingReport?.dailyReport?.overTimeDuration || {};

  // Convert hours, minutes, and seconds into total seconds
  const totalSecondsWorked =
    todayWorkingTime.hours * 3600 + todayWorkingTime.minutes * 60 + todayWorkingTime.seconds;

  const totalSecondsRemaining =
    todayRemainingTime.hours * 3600 + todayRemainingTime.minutes * 60 + todayRemainingTime.seconds;

  const totalSecondsOvertime =
    todayOvertime.hours * 3600 + todayOvertime.minutes * 60 + todayOvertime.seconds;

  // Create series and labels for the chart
  const chartSeries = [totalSecondsWorked, totalSecondsRemaining, totalSecondsOvertime];

  const chartLabels = ['Worked', 'Remaining', 'Overtime'];

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: chartLabels,

    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => {
          const hours = Math.floor(value / 3600);
          const minutes = Math.floor((value % 3600) / 60);
          const seconds = value % 60;
          return `${hours}:${minutes}:${seconds}`;
        },
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (value) => {
                const hours = Math.floor(value / 3600);
                const minutes = Math.floor((value % 3600) / 60);
                const seconds = value % 60;
                return `${hours}:${minutes}:${seconds}`;
              },
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                const hours = Math.floor(sum / 3600);
                const minutes = Math.floor((sum % 3600) / 60);
                const seconds = sum % 60;
                return `${hours}:${minutes}:${seconds}`;
              },
            },
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <StyledChart dir="ltr">
        <Chart type="donut" series={chartSeries} options={chartOptions} height={280} />
      </StyledChart>
    </Card>
  );
}
