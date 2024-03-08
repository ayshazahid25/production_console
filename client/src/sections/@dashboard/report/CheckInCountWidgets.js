import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';

import Chart, { useChart } from '../../../components/chart';

import { fShortenNumber } from '../../../utils/formatNumber';
// ----------------------------------------------------------------------

const CHART_SIZE = {
  width: 106,
  height: 106,
};

CheckInCountWidgets.propTypes = {
  sx: PropTypes.object,
  color: PropTypes.string,
  title: PropTypes.string,
  percent: PropTypes.number,
  total: PropTypes.number,
};

export default function CheckInCountWidgets({
  title,
  percent,
  total,

  color = 'primary',
  sx,
  ...other
}) {
  const theme = useTheme();

  const chartOptionsCheckIn = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      padding: {
        top: -9,
        bottom: -9,
      },
    },
    legend: {
      show: false,
    },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontSize: theme.typography.subtitle2.fontSize,
          },
        },
      },
    },
    colors: [theme.palette[color].main], // Set the color dynamically
  });

  return (
    <Card
      sx={{
        py: 5,
        boxShadow: 0,
        textAlign: 'center',
        color: theme.palette[color].darker,
        bgcolor: theme.palette[color].lighter,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Center horizontally
        justifyContent: 'center', // Center vertically
        ...sx,
      }}
      {...other}
    >
      <Chart type="radialBar" series={[percent]} options={chartOptionsCheckIn} {...CHART_SIZE} />

      <Typography variant="h3">{total > 0 ? fShortenNumber(total) : total}</Typography>

      <Typography variant="subtitle2" sx={{ opacity: 0.64 }}>
        {title}
      </Typography>
    </Card>
  );
}
