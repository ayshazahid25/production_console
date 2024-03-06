import * as types from '../actions';

const INITIAL_STATE = {
  message: null,
  error: null,
};

export default function user(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_CATEGORY_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    default: {
      return state;
    }
  }
}
