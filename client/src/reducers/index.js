import { combineReducers } from 'redux';
import AuthReducer from './auth';
import CarReducer from './car';
import CategoryReducer from './category';
import UserReducer from './user';
import ReportReducer from './report';

export default combineReducers({
  Auth: AuthReducer,
  Car: CarReducer,
  Category: CategoryReducer,
  Users: UserReducer,
  Reports: ReportReducer,
});
