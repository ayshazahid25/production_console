import * as types from './index';

// ********** CHECKIN CHECKOUT **********
// send the request to record checkin or checkout value
export const recordCheckInRequest = (data) => ({
  type: types.RECORD_CHECKINS_RESQUEST,
  payload: {
    data,
  },
});
// successfully recorded checkin or checkout value
export const recordCheckInSuccess = ({ message }) => ({
  type: types.RECORD_CHECKINS_RESQUEST_SUCCESS,
  payload: {
    message,
  },
});
// send the request to get user's working time and remaing time
export const getReportOfRemainingWorkingHoursRequest = () => ({
  type: types.GET_REPORT_OF_REMAINING_WORKING_HOURS_REQUEST,
});

// successfully fetched user's working time and remaing time
export const getReportOfRemainingWorkingHoursSuccess = ({ report }) => ({
  type: types.GET_REPORT_OF_REMAINING_WORKING_HOURS_SUCCESS,
  payload: {
    report,
  },
});

// send the request to get user's working time and over time of specific month group by days
export const getReportOfRemainingWorkingHoursOfMonthByDaysRequest = (data) => ({
  type: types.GET_REPORT_OF_REMAINING_WORKING_HOURS_OF_MONTH_BY_DAYS_REQUEST,
  payload: {
    data,
  },
});

// successfully fetched user's working time and over time of specific month group by days
export const getReportOfRemainingWorkingHoursOfMonthByDaysSuccess = ({ report }) => ({
  type: types.GET_REPORT_OF_REMAINING_WORKING_HOURS_OF_MONTH_BY_DAYS_SUCCESS,
  payload: {
    report,
  },
});

// ********** DASHBOARD **********
// send the request to fetch admin dashboard reports of checkIn, late checkIns, and users on leave
export const getAdminDashboardRequest = () => ({
  type: types.GET_ADMIN_DASHOARD_CHECKIN_REPORT_REQUEST,
});
// sending the data to redux store of admin dashboard reports of checkIn, late checkIns, and users on leave
export const getAdminDashboardSuccess = ({ data }) => ({
  type: types.GET_ADMIN_DASHOARD_CHECKIN_REPORT_SUCCESS,
  payload: {
    data,
  },
});

// ********** LOADING **********
// set loading
export const setLoading = ({ loading }) => ({
  type: types.SET_LOADING,
  payload: {
    loading,
  },
});

export const reportError = ({ error }) => ({
  type: types.REPORT_ERROR,
  payload: {
    error,
  },
});

export const clearReportData = () => ({
  type: types.CLEAR_REPORT_DATA,
});

export const clearAdminDashbaordData = () => ({
  type: types.CLEAR_ADMIN_DASHBOARD_DATA,
});

export const clearMessage = () => ({
  type: types.CLEAR_MESSAGE,
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
});
