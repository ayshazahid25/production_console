import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, LinearProgress, Paper, Stack } from '@mui/material';

import { getAdminDashboardRequest, clearAdminDashbaordData } from '../../../actions/report';

import CheckInCountWidgets from './CheckInCountWidgets';

// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../../../routes/paths';

function AdminDashboard({
  Auth: { isAuthenticated },
  Reports: { adminDashboard, loading },
  getAdminDashboard,
  clrAdminDashboard,
}) {
  const navigate = useNavigate();
  const theme = useTheme();

  const [adminDasboardData, setAdminDasboardData] = useState();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }

    if (adminDashboard == null) {
      getAdminDashboard();
    } else {
      setAdminDasboardData(adminDashboard);
    }
    // eslint-disable-next-line
  }, [
    isAuthenticated,
    adminDashboard,
    // error
  ]);
  useEffect(
    () => () => clrAdminDashboard(),
    // eslint-disable-next-line
    []
  );

  return (
    <>
      {loading ? (
        <Grid container spacing={3} rowSpacing={2}>
          <Grid item xs={12} md={12}>
            <Stack alignItems="center" sx={{ my: 15 }}>
              <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <>
          {adminDasboardData && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <CheckInCountWidgets
                  percent={adminDasboardData.onTimePercentage}
                  title="On-Time Arrivals"
                  total={adminDasboardData.onTimeCheckIns}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <CheckInCountWidgets
                  percent={adminDasboardData.latePercentage}
                  title="Late Arrivals"
                  total={adminDasboardData.lateCheckIns}
                  color="warning"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CheckInCountWidgets
                  percent={adminDasboardData.notCheckedInPercentage}
                  title="Employees Not Checked In"
                  total={adminDasboardData.notCheckedIn}
                  color="error"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <CheckInCountWidgets
                  percent={adminDasboardData.usersOnLeavePercentage}
                  title="Employees On Leave"
                  total={adminDasboardData.usersOnLeave}
                  color="info"
                />
              </Grid>
            </Grid>
          )}
        </>
      )}
    </>
  );
}

AdminDashboard.propTypes = {
  Auth: PropTypes.object.isRequired,
  Reports: PropTypes.object.isRequired,
  getAdminDashboard: PropTypes.func.isRequired,
  clrAdminDashboard: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Reports: state.Reports,
});

export default connect(mapStateToProps, {
  getAdminDashboard: getAdminDashboardRequest,
  clrAdminDashboard: clearAdminDashbaordData,
})(AdminDashboard);
