import * as types from '../actions';

const INITIAL_STATE = {
  adminDashboard: null,
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
    case types.REPORT_ERROR: {
      return {
        ...state,
        error: action.payload.error,
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
