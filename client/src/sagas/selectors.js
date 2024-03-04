import { select } from 'redux-saga/effects';

export function* getAuthTokenFromSaga() {
  const token = yield select((state) => state.Auth.token);
  return token;
}

export function* getUserIdFromSaga() {
  const id = yield select((state) => state.Auth.user.id);
  return id;
}
