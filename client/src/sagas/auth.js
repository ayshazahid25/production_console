import { takeEvery, call, put, fork, takeLatest } from 'redux-saga/effects';
import * as types from '../actions';
import * as actions from '../actions/auth';

import { getAuthTokenFromSaga } from './selectors';
import * as api from '../api/auth';

import { setSession } from '../auth/utils';

function* initSessionAndSocket({ payload }) {
  try {
    setSession(payload.token);
  } catch (e) {
    if (
      e.message === 'Error: Not authorized, no token' ||
      e.message === 'JsonWebTokenError: invalid signature'
    ) {
      setSession(null);
      yield put(actions.logoutRequest());
    }

    yield put(
      actions.loginError({
        error: e.message,
      })
    );
  }
}

function* watchInitSessionAndSocket() {
  yield takeLatest(types.INITIALIZE_SESSION_AND_SOCKET, initSessionAndSocket);
}

function* getUsers(payload) {
  try {
    const result = yield call(api.getUser);

    yield put(
      actions.getUserSuccess({
        items: result.data,
        accessToken: payload.accessToken,
      })
      // isAuthenticated: true,
    );
  } catch (e) {
    // isAuthenticated:
    //       action.payload.error === 'Error: Not authorized, no token'
    //         ? false
    //         : state.isAuthenticated,
    //     user: action.payload.error === 'Error: Not authorized, no token' ? false : state.user,
    //     token: action.payload.error === 'Error: Not authorized, no token' ? false : state.token,
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(actions.logoutRequest());
    }

    yield put(
      actions.loginError({
        error: e.message,
      })
    );
  }
}

function* watchGetUserRequest() {
  yield takeLatest(types.GET_USER_REQUEST, getUsers);
}

function* loginSaga(payload) {
  try {
    const response = yield call(api.loginUser, payload.user);

    yield put(actions.initializeSessionAndSocket(response.data.token));

    const result = yield call(api.getUser);
    // getting the current user

    yield put(actions.loginUserSuccess({ token: response.data.token }));
    yield put(
      actions.getUserSuccess({
        items: result.data,
        accessToken: response.data.token,
      })
      // isAuthenticated: true,
    );
  } catch (e) {
    yield put(
      actions.loginError({
        error: e.message,
      })
    );
  }
}

function* updateUserProfile({ payload }) {
  try {
    const token = yield call(getAuthTokenFromSaga);
    const userData = payload.user;

    const formData = new FormData();
    formData.append('userData', JSON.stringify(userData)); // 'image' is the name of the field expected by the server
    formData.append('userImage', payload.avatarUrl); // 'image' is the name of the field expected by the server

    const response = yield call(api.updateUserProfile, { userId: payload.userId, formData });

    yield put(
      actions.updateUserProfileSuccess({
        message: response.data.message,
      })
    );

    yield put(
      actions.getUserRequest({
        accessToken: token,
      })
    );
  } catch (e) {
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(actions.logoutRequest());
    }
    yield put(
      actions.loginError({
        error: e.message || e,
      })
    );
  }
}

function* watchUpdateUserProfileRequest() {
  yield takeLatest(types.UPDATE_USER_PROFILE_REQUEST, updateUserProfile);
}

function* watchUserAuthentication() {
  yield takeLatest(types.LOGIN_USER, loginSaga);
}
function* logout() {
  try {
    setSession(null);
    yield put(actions.logoutSuccess());
  } catch (e) {
    yield put(
      actions.loginError({
        error: e.message || e,
      })
    );
  }
}

function* watchLogoutRequest() {
  yield takeEvery(types.LOGOUT_REQUEST, logout);
}

const authSagas = [
  fork(watchInitSessionAndSocket),
  fork(watchGetUserRequest),
  fork(watchUserAuthentication),
  fork(watchUpdateUserProfileRequest),
  fork(watchLogoutRequest),
];

export default authSagas;
