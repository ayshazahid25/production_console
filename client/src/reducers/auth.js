import * as types from '../actions';

const INITIAL_STATE = {
  token: null,
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  error: null,
  message: null,
};

export default function auth(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.INITIAL: {
      return {
        ...state,
        isInitialized: true,
        isAuthenticated: false,
      };
    }
    case types.GET_USER_SUCCESS: {
      return {
        ...state,
        token: action.payload.accessToken,
        isInitialized: true,
        user: action.payload.items,
        isAuthenticated: true,
        error: null,
      };
    }

    case types.UPDATE_USER_PROFILE_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    case types.LOGIN_USER_SUCCESS: {
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      };
    }
    case types.LOGOUT_SUCCESS: {
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        user: null,
        token: null,
      };
    }
    case types.LOGIN_USER_ERROR: {
      return {
        ...state,
        error: action.payload.error,
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
