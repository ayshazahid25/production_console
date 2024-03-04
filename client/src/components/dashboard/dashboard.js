import { memo } from 'react';
import PropTypes from 'prop-types';
import { Card, Typography } from '@mui/material';

const Dashboard = ({ color = 'grey', name, totalCars }) => (
  <Card
    sx={{
      py: 4,
      mt: 1,
      ml: 1,
      boxShadow: 1,
      textAlign: 'center',
      color: '#000',
      bgcolor: '#F4F6F8',
    }}
  >
    <Typography variant="h3">{name}</Typography>
    <Typography variant="subtitle1" sx={{ opacity: 0.64 }}>
      {totalCars || 0}
    </Typography>
  </Card>
);
Dashboard.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string,
  totalCars: PropTypes.number,
};

export default memo(Dashboard);
