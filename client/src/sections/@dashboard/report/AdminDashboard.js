import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// @mui
import { Grid, LinearProgress, Stack } from '@mui/material';

import { getAdminDashboardRequest, clearAdminDashbaordData } from '../../../actions/report';

import CheckInCountWidgets from './CheckInCountWidgets';

function AdminDashboard({ Reports: { adminDashboard }, getAdminDashboard, clrAdminDashboard }) {
  const [adminDasboardData, setAdminDasboardData] = useState();

  useEffect(() => {
    if (adminDashboard == null) {
      getAdminDashboard();
    } else {
      setAdminDasboardData(adminDashboard);
    }
    // eslint-disable-next-line
  }, [
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
      {adminDasboardData && (
        <>
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
        </>
      )}
    </>
  );
}

AdminDashboard.propTypes = {
  Reports: PropTypes.object.isRequired,
  getAdminDashboard: PropTypes.func.isRequired,
  clrAdminDashboard: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Reports: state.Reports,
});

export default connect(mapStateToProps, {
  getAdminDashboard: getAdminDashboardRequest,
  clrAdminDashboard: clearAdminDashbaordData,
})(AdminDashboard);
