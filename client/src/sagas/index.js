import { all } from 'redux-saga/effects';
import authSagas from './auth';
import carSagas from './car';
import categorySagas from './category';

export default function* rootSaga() {
  yield all([...authSagas, ...carSagas, ...categorySagas]);
}
