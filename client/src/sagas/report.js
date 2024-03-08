import { takeEvery, call, put, fork } from 'redux-saga/effects';
import * as actions from '../actions/report';
import * as authActions from '../actions/auth';
import * as api from '../api/report';
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

const reportSagas = [fork(watchGetAdminDashboardRequest)];

export default reportSagas;
