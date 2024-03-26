import * as types from '../actions';

const INITIAL_STATE = {
  users: null,
  user: null,
  loading: false,
  message: null,
  error: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_ALL_USERS_SUCCESS: {
      return {
        ...state,
        users: action.payload.users,
        message: null,
        error: null,
      };
    }
    case types.GET_USER_BY_ID_SUCCESS: {
      return {
        ...state,
        user: action.payload.userdetails,
        message: null,
        error: null,
      };
    }
    case types.CREATE_USER_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    case types.UPDATE_USER_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    case types.DELETE_USERS_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    case types.SET_LOADING: {
      return {
        ...state,
        loading: action.payload.loading,
      };
    }

    case types.USER_ERROR: {
      return {
        ...state,
        error: action.payload.error,
      };
    }
    case types.CLEAR_USER_LIST: {
      return {
        ...state,
        users: null,
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
