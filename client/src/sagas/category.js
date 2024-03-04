import { takeEvery, call, put, fork } from 'redux-saga/effects';
import * as actions from '../actions/category';
import * as authActions from '../actions/auth';
import * as api from '../api/category';
import * as types from '../actions';
import { setSession } from '../auth/utils';

function* getCategory() {
  try {
    const result = yield call(api.getCategory);

    yield put(
      actions.getCategorySuccess({
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
        actions.categoryError({
          error: e.message,
        })
      );
    }
  }
}

function* watchGetCategoryRequest() {
  yield takeEvery(types.GET_CATEGORY_REQUEST, getCategory);
}

function* createCategory({ payload }) {
  try {
    const result = yield call(api.createCategory, payload);

    yield put(
      actions.createCategorySuccess({
        message: result.data,
      })
    );
    yield put(actions.getCategoryRequest());
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
        actions.categoryError({
          error: e.message,
        })
      );
    }
  }
}

function* watchCreateCategoryRequest() {
  yield takeEvery(types.CREATE_CATEGORY_REQUEST, createCategory);
}

function* updateCategory({ payload }) {
  try {
    const result = yield call(api.updateCategory, payload);

    yield put(
      actions.updateCategorySuccess({
        message: result.data,
      })
    );

    yield put(actions.getCategoryRequest());
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
        actions.categoryError({
          error: e.message,
        })
      );
    }
  }
}

function* watchUpdateCategoryRequest() {
  yield takeEvery(types.UPDATE_CATEGORY_REQUEST, updateCategory);
}

function* deleteCategory({ payload }) {
  try {
    const result = yield call(api.deleteCategory, payload);

    yield put(
      actions.deleteCategorySuccess({
        message: result.data,
      })
    );

    yield put(actions.getCategoryRequest());
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
        actions.categoryError({
          error: e.message,
        })
      );
    }
  }
}

function* watchDeleteCategoryRequest() {
  yield takeEvery(types.DELETE_CATEGORY_REQUEST, deleteCategory);
}

const categorySagas = [
  fork(watchGetCategoryRequest),
  fork(watchCreateCategoryRequest),
  fork(watchUpdateCategoryRequest),
  fork(watchDeleteCategoryRequest),
];

export default categorySagas;
