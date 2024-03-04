import { takeEvery, call, put, fork, takeLatest } from 'redux-saga/effects';
import * as types from '../actions';
import * as actions from '../actions/auth';

import * as api from '../api/auth';

import { setSession } from '../auth/utils';

function* initSession({ payload }) {
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

function* watchInitSession() {
  yield takeLatest(types.INITIALIZE_SESSION, initSession);
}

function* getUsers(payload) {
  console.log('inside saaagagaaa', payload);
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

function* registerSaga({ payload }) {
  try {
    const response = yield call(api.registerUser, payload);

    yield put(actions.initializeSession(response.data.token));

    yield put(actions.initializeSession(response.data.token));
    const result = yield call(api.getUser);
    // getting the current user

    yield put(actions.loginUserSuccess({ token: response.data.token }));
    yield put(
      actions.getUserSuccess({
        items: result.data,
        accessToken: response.data.token,
      })
    );

    yield put(actions.registerUserSuccess({ message: response.data.message }));
  } catch (e) {
    yield put(
      actions.loginError({
        error: e,
      })
    );
  }
}

function* loginSaga(payload) {
  try {
    const response = yield call(api.loginUser, payload.user);

    yield put(actions.initializeSession(response.data.token));
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
        error: e.message || e,
      })
    );
  }
}

function* watchUserAuthentication() {
  yield takeLatest(types.REGISTER_USER_REQUEST, registerSaga);
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
  fork(watchInitSession),
  fork(watchGetUserRequest),
  fork(watchUserAuthentication),
  fork(watchLogoutRequest),
];

export default authSagas;
