import * as types from '../actions';

const INITIAL_STATE = {
  adminDashboard: null,
  monthlyWorkingReport: null,
  loading: false,
  message: null,
  error: null,
};

export default function report(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_ADMIN_DASHOARD_CHECKIN_REPORT_SUCCESS: {
      return {
        ...state,
        adminDashboard: action.payload.data,
        message: null,
        error: null,
      };
    }
    case types.SET_LOADING: {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }
    case types.GET_REPORT_OF_REMAINING_WORKING_HOURS_SUCCESS: {
      return {
        ...state,
        workingReport: action.payload.report,
        message: null,
        error: null,
      };
    }
    case types.GET_REPORT_OF_REMAINING_WORKING_HOURS_OF_MONTH_BY_DAYS_SUCCESS: {
      return {
        ...state,
        monthlyWorkingReport: action.payload.report,
        message: null,
        error: null,
      };
    }
    case types.RECORD_CHECKINS_RESQUEST_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    case types.REPORT_ERROR: {
      return {
        ...state,
        error: action.payload.error,
      };
    }
    case types.CLEAR_REPORT_DATA: {
      return {
        ...state,
        workingReport: null,
        monthlyWorkingReport: null,
        message: null,
        error: null,
      };
    }
    case types.CLEAR_ADMIN_DASHBOARD_DATA: {
      return {
        ...state,
        adminDashboard: null,
        message: null,
        error: null,
      };
    }
    case types.CLEAR_MESSAGE: {
      return {
        ...state,
        message: null,
      };
    }
    case types.CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      };
    }

    default: {
      return state;
    }
  }
}
