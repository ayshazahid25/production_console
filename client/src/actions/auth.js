import * as types from './index';

export const initial = () => ({
  type: types.INITIAL,
});

export const initializeSessionAndSocket = (token) => ({
  type: types.INITIALIZE_SESSION_AND_SOCKET,
  payload: {
    token,
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

export const updateUserProfileRequest = (userId, userData) => ({
  type: types.UPDATE_USER_PROFILE_REQUEST,
  payload: {
    userId,
    user: {
      title: userData.title,
      gender: userData.gender,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      phone_number: userData.phone_number,
      CNIC: userData.CNIC,
      address: userData.address,
    },
    avatarUrl: userData.avatarUrl,
  },
});

export const updateUserProfileSuccess = ({ message }) => ({
  type: types.UPDATE_USER_PROFILE_SUCCESS,
  payload: {
    message,
  },
});

//   // LOGOUT
//   const logout = useCallback(() => {
//     setSession(null);
//     dispatch({
//       type: 'LOGOUT',
//     });
//   }, []);

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
