import PropTypes from 'prop-types';
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader } from '@mui/material';

// components
import Chart, { useChart } from '../../../../components/chart';
import PickerMonth from '../../../_examples/mui/pickers/PickerMonth';

const StyledChart = styled('div')(({ theme }) => ({
  height: 400,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': {
    height: 400,
  },
}));

const CustomCardHeader = styled(CardHeader)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
  cardHeaderAction: {
    background: 'blue',
  },
}));

MonthlyReportChart.propTypes = {
  monthlyReport: PropTypes.array.isRequired,
};

export default function MonthlyReportChart({ monthlyReport }) {
  // Extracting data for chart series

  const workedHoursData = monthlyReport.map(
    (entry) =>
      entry.report.workedHours.hours * 3600 +
      entry.report.workedHours.minutes * 60 +
      entry.report.workedHours.seconds
  );
  const overtimeHoursData = monthlyReport.map(
    (entry) =>
      entry.report.overTimeDuration.hours * 3600 +
      entry.report.overTimeDuration.minutes * 60 +
      entry.report.overTimeDuration.seconds
  );

  const dates = monthlyReport.map((entry) => new Date(entry.report.date).toLocaleDateString()); // Extracting only date

  const series = [
    { name: 'Worked Hours', data: workedHoursData },
    { name: 'Overtime Hours', data: overtimeHoursData },
  ];

  const chartOptions = useChart({
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: dates,
    },
    tooltip: {
      y: {
        formatter: (value) => {
          const hours = Math.floor(value / 3600);
          const minutes = Math.floor((value % 3600) / 60);
          const seconds = value % 60;
          return `${hours}:${minutes}:${seconds}`;
        },
      },
    },
    plotOptions: { bar: { columnWidth: '36%' } },
  });

  return (
    <Card>
      <CardHeader style={{ textAlign: 'center' }} title={<PickerMonth />} />

      <StyledChart>
        <Chart type="bar" series={series} options={chartOptions} height={320} />
      </StyledChart>
    </Card>
  );
}
