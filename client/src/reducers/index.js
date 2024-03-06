import { combineReducers } from 'redux';
import AuthReducer from './auth';
import CarReducer from './car';
import CategoryReducer from './category';
import UserReducer from './user';

export default combineReducers({
  Auth: AuthReducer,
  Car: CarReducer,
  Category: CategoryReducer,
  Users: UserReducer,
});
