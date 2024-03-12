import { takeEvery, call, put, fork, takeLatest } from 'redux-saga/effects';
import * as actions from '../actions/report';
import * as authActions from '../actions/auth';
import * as api from '../api/report';
import * as authApi from '../api/auth';
import * as types from '../actions';
import { setSession } from '../auth/utils';

function* getAdminDashoard() {
  try {
    yield put(
      actions.setLoading({
        loading: true,
      })
    );

    const result = yield call(api.getAdminDasboard);

    yield put(
      actions.getAdminDashboardSuccess({
        data: result.data,
      })
    );

    yield put(
      actions.setLoading({
        loading: false,
      })
    );
  } catch (e) {
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.setLoading({
          loading: false,
        })
      );
      yield put(
        actions.reportError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetAdminDashboardRequest() {
  yield takeEvery(types.GET_ADMIN_DASHOARD_CHECKIN_REPORT_REQUEST, getAdminDashoard);
}

function* recordCheckIns({ payload }) {
  try {
    const response = yield call(api.recordCheckIns, payload.data);

    yield put(
      actions.recordCheckInSuccess({
        message: response.data.message,
      })
    );

    const result = yield call(authApi.getUser);

    yield put(
      authActions.getUserSuccess({
        items: result.data,
        accessToken: response.data.token,
      })
      // isAuthenticated: true,
    );
  } catch (e) {
    if (e.message === 'Error: Not authorized, no token') {
      setSession(null);
      yield put(authActions.logoutRequest());

      yield put(
        authActions.loginError({
          error: e.message,
        })
      );
    } else {
      yield put(
        actions.reportError({
          error: e.message || e,
        })
      );
    }
  }
}

function* watchRecordCheckInsRequest() {
  yield takeLatest(types.RECORD_CHECKINS_RESQUEST, recordCheckIns);
}

const reportSagas = [fork(watchGetAdminDashboardRequest), fork(watchRecordCheckInsRequest)];

export default reportSagas;
