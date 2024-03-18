import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, LinearProgress, Stack } from '@mui/material';
import { useSettingsContext } from '../../components/settings';

// sections
import { AdminDashboard } from '../../sections/@dashboard/report';
import CheckInCheckOutDialog from '../../sections/@dashboard/report/CheckInCheckOutDialog';
import { PATH_AUTH } from '../../routes/paths';
import { AppCurrentDownload } from '../../sections/@dashboard/general/app';
import {
  getReportOfRemainingWorkingHoursRequest,
  getReportOfRemainingWorkingHoursOfMonthByDaysRequest,
  clearReportData,
} from '../../actions/report';
import MonthlyReportChart from '../../sections/@dashboard/general/app/MonthlyReportChart';
import formatDate from '../../utils/formateMonthAndYear';

function DashboardPage({
  Auth: { user, isAuthenticated },
  Reports: { workingReport, monthlyWorkingReport, loading },
  getRemainingWorkingHours,
  getRemainingWorkingHoursOfMonth,
  clrReportData,
}) {
  const navigate = useNavigate();
  const theme = useTheme();
  const { themeStretch } = useSettingsContext();
  const [selectedReportType, setSelectedReportType] = useState('dailyReport');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(PATH_AUTH.login, { replace: true });
    }
    // eslint-disable-next-line
  }, [isAuthenticated]);

  useEffect(() => {
    if (workingReport == null) {
      getRemainingWorkingHours();
    }
    // eslint-disable-next-line
  }, [workingReport]);
  useEffect(() => {
    if (monthlyWorkingReport == null) {
      const formattedDate = formatDate(new Date());
      getRemainingWorkingHoursOfMonth({ specificMonth: formattedDate });
    }
    // eslint-disable-next-line
  }, [monthlyWorkingReport]);
  useEffect(
    () => () => clrReportData(),
    // eslint-disable-next-line
    []
  );

  // Dynamically generate the title based on the selected report type
  const dynamicTitle =
    selectedReportType === 'dailyReport'
      ? "Today's Report"
      : selectedReportType === 'weeklyReport'
      ? "This Week's Report"
      : "This Month's Report";
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
          sx={{ mb: 3 }}
        >
          <Grid item xs={12} md={8}>
            <Typography variant="h4">Hi, Welcome back to Production Console</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <CheckInCheckOutDialog lastCheckIn={user.lastCheckIn} />
          </Grid>
        </Grid>

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
            <Grid container spacing={3} rowSpacing={2}>
              <Grid item xs={12} md={12}>
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
              <Grid item xs={12} md={12} lg={6} sx={{ mb: 3 }}>
                {workingReport && (
                  <AppCurrentDownload
                    title={dynamicTitle}
                    subheader="Worked / Remaining / Overtime"
                    chart={{
                      colors: [theme.palette.primary.main, theme.palette.error.main],
                    }}
                    workingReport={workingReport}
                    selectedReportType={selectedReportType}
                    onSelectReportType={setSelectedReportType}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={12} lg={6} sx={{ mb: 3 }}>
                {monthlyWorkingReport && (
                  <MonthlyReportChart monthlyReport={monthlyWorkingReport} />
                )}
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
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}

DashboardPage.propTypes = {
  Auth: PropTypes.object.isRequired,
  Reports: PropTypes.object.isRequired,
  getRemainingWorkingHours: PropTypes.func.isRequired,
  getRemainingWorkingHoursOfMonth: PropTypes.func.isRequired,
  clrReportData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  Auth: state.Auth,
  Reports: state.Reports,
});

export default connect(mapStateToProps, {
  getRemainingWorkingHours: getReportOfRemainingWorkingHoursRequest,
  getRemainingWorkingHoursOfMonth: getReportOfRemainingWorkingHoursOfMonthByDaysRequest,
  clrReportData: clearReportData,
})(DashboardPage);
