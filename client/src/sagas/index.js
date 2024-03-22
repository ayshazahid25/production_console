import { all } from 'redux-saga/effects';
import authSagas from './auth';
import carSagas from './car';
import categorySagas from './category';
import reportSagas from './report';
import userSagas from './user';

export default function* rootSaga() {
  yield all([...authSagas, ...carSagas, ...categorySagas, ...reportSagas, ...userSagas]);
}
