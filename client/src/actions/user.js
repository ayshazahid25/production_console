import * as types from './index';

// ********** GET USERS **********
// send the request to fetch all users
export const getAllUsersRequest = () => ({
  type: types.GET_ALL_USERS_REQUEST,
});
// sending the data to redux store of all users
export const getAllUsersSuccess = ({ users }) => ({
  type: types.GET_ALL_USERS_SUCCESS,
  payload: {
    users,
  },
});

// ********** GET USER BY ID **********
// send the request to fetch user by id
export const getUserByIdRequest = (userId) => ({
  type: types.GET_USER_BY_ID_REQUEST,
  payload: {
    userId,
  },
});

// sending the data to redux store of the user
export const getUserByIdSuccess = ({ userdetails }) => ({
  type: types.GET_USER_BY_ID_SUCCESS,
  payload: {
    userdetails,
  },
});
export const resetPasswordRequest = () => ({
  type: types.RESET_PASSWORD_REQUEST,
});

// ********** UPDATING **********
export const updateUserRequest = (userId, userData) => ({
  type: types.UPDATE_USER_REQUEST,
  payload: {
    userId,
    user: {
      title: userData.title,
      gender: userData.gender,
      first_name: userData.first_name,
      last_name: userData.last_name,
      email: userData.email,
      billing_rate: userData.billing_rate,
      phone_number: userData.phone_number,
      cnic: userData.CNIC,
      address: userData.address,
    },
  },
});

export const updateUserSuccess = ({ message }) => ({
  type: types.UPDATE_USER_SUCCESS,
  payload: {
    message,
  },
});

// ********** BULK FREEZE **********
export const deleteUserRequest = ({ userId, is_active, isEdit = false }) => ({
  type: types.DELETE_USER_REQUEST,
  payload: {
    userId,
    is_active,
    isEdit,
  },
});

export const deleteUsersSuccess = ({ message }) => ({
  type: types.DELETE_USERS_SUCCESS,
  payload: {
    message,
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

export const userError = ({ error }) => ({
  type: types.USER_ERROR,
  payload: {
    error,
  },
});

export const clearUserList = () => ({
  type: types.CLEAR_USER_LIST,
});
export const clearUser = () => ({
  type: types.CLEAR_USER,
});

export const clearMessage = () => ({
  type: types.CLEAR_MESSAGE,
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
});
