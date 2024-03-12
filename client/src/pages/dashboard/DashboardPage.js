import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, Button } from '@mui/material';
import { EcommerceCurrentBalance } from '../../sections/@dashboard/general/e-commerce';
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';
import PickerTime from '../../sections/_examples/mui/pickers/PickerTime';

import { AdminDashboard, CheckInCountWidgets } from '../../sections/@dashboard/report';
import Iconify from '../../components/iconify';
import CheckInCheckOutDialog from '../../sections/@dashboard/report/CheckInCheckOutDialog';

function DashboardPage({ Auth: { user, isAuthenticated } }) {
  const theme = useTheme();
  const [checkInTime, setCheckInTime] = useState(new Date());
  const [checkOutTime, setCheckOutTime] = useState(new Date());

  const { themeStretch } = useSettingsContext();
  const handleCheckInTimeChange = (newTime) => {
    setCheckInTime(newTime);
  };

  const handleCheckOutTimeChange = (newTime) => {
    setCheckOutTime(newTime);
  };

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid
          container
          spacing={3}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Grid item xs={12} md={8}>
            <Typography variant="h4">Hi, Welcome back to Production Console</Typography>
          </Grid>
          <Grid item xs={12} md={2}>
            <CheckInCheckOutDialog lastCheckIn={user.lastCheckIn} />
          </Grid>
          <Grid item xs={12} md={12} sx={{ mb: 3 }}>
            {user.todayCheckIn ? (
              <Typography variant="h6">
                {`Today's Check-In Time: ${new Date(
                  user.todayCheckIn.check_in_time
                ).toLocaleTimeString()}`}
              </Typography>
            ) : (
              <Typography>No check-in recorded for today.</Typography>
            )}
          </Grid>
        </Grid>

        {user.is_admin === true ? (
          <AdminDashboard />
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <h2>ann</h2>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}

DashboardPage.propTypes = {
  Auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
});

export default connect(mapStateToProps, {})(DashboardPage);
