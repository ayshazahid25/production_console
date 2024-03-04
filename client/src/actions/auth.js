import * as types from './index';

export const initial = () => ({
  type: types.INITIAL,
});

export const initializeSession = (token) => ({
  type: types.INITIALIZE_SESSION,
  payload: {
    token,
  },
});

export const registerUserRequest = (user) => ({
  type: types.REGISTER_USER_REQUEST,
  payload: {
    ...user,
  },
});
export const registerUserSuccess = ({ message }) => ({
  type: types.REGISTER_USER_SUCCESS,
  payload: {
    message,
  },
});

export const loginUserAction = (user) => ({
  type: types.LOGIN_USER,
  user,
});

export const loginUserSuccess = ({ items }) => ({
  type: types.LOGIN_USER_SUCCESS,
  payload: {
    items,
  },
});

export const getUserRequest = (accessToken) => ({
  type: types.GET_USER_REQUEST,
  accessToken,
});

export const getUserSuccess = ({ items, accessToken }) => ({
  type: types.GET_USER_SUCCESS,
  payload: {
    items,
    accessToken,
  },
});

export const logoutRequest = () => ({ type: types.LOGOUT_REQUEST });

export const logoutSuccess = () => ({ type: types.LOGOUT_SUCCESS });

export const loginError = ({ error }) => ({
  type: types.LOGIN_USER_ERROR,
  payload: {
    error,
  },
});

export const clearMessage = () => ({
  type: types.CLEAR_MESSAGE,
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
});
