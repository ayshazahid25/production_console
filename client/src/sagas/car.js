import { takeEvery, call, put, fork } from 'redux-saga/effects';
import * as actions from '../actions/car';
import * as authActions from '../actions/auth';
import * as api from '../api/car';
import * as types from '../actions';
import { setSession } from '../auth/utils';

function* getTotalCar() {
  try {
    const result = yield call(api.getTotalCar);

    yield put(
      actions.getTotalCarSuccess({
        items: result.data,
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
        actions.carError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetTotalCarRequest() {
  yield takeEvery(types.GET_TOTAL_CAR_REQUEST, getTotalCar);
}

function* getCar() {
  try {
    const result = yield call(api.getCar);

    yield put(
      actions.getCarSuccess({
        items: result.data,
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
        actions.carError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetCarRequest() {
  yield takeEvery(types.GET_CAR_REQUEST, getCar);
}

function* createCar({ payload }) {
  try {
    const result = yield call(api.createCar, payload);

    yield put(
      actions.createCarSuccess({
        message: result.data,
      })
    );
    yield put(actions.getCarRequest());
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
        actions.carError({
          error: e.message,
        })
      );
    }
  }
}

function* watchCreateCarRequest() {
  yield takeEvery(types.CREATE_CAR_REQUEST, createCar);
}

function* updateCar({ payload }) {
  try {
    console.log(payload);
    const result = yield call(api.updateCar, payload);

    yield put(
      actions.updateCarSuccess({
        message: result.data,
      })
    );

    yield put(actions.getCarRequest());
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
        actions.carError({
          error: e.message,
        })
      );
    }
  }
}

function* watchUpdateCarRequest() {
  yield takeEvery(types.UPDATE_CAR_REQUEST, updateCar);
}

function* deleteCar({ payload }) {
  try {
    const result = yield call(api.deleteCar, payload);

    yield put(
      actions.deleteCarSuccess({
        message: result.data,
      })
    );

    yield put(actions.getCarRequest());
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
        actions.carError({
          error: e.message,
        })
      );
    }
  }
}

function* watchDeleteCarRequest() {
  yield takeEvery(types.DELETE_CAR_REQUEST, deleteCar);
}

const carSagas = [
  fork(watchGetTotalCarRequest),
  fork(watchGetCarRequest),
  fork(watchCreateCarRequest),
  fork(watchUpdateCarRequest),
  fork(watchDeleteCarRequest),
];

export default carSagas;
