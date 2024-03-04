import * as types from '../actions';

const INITIAL_STATE = {
  categoryList: null,
  category: null,
  message: null,
  error: null,
};

export default function category(state = INITIAL_STATE, action) {
  switch (action.type) {
    case types.GET_CATEGORY_SUCCESS: {
      return {
        ...state,
        categoryList: action.payload.items,
        message: null,
        error: null,
      };
    }
    case types.CREATE_CATEGORY_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    case types.UPDATE_CATEGORY_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }
    case types.DELETE_CATEGORY_SUCCESS: {
      return {
        ...state,
        message: action.payload.message,
        error: null,
      };
    }

    case types.CATEGORY_ERROR: {
      return {
        ...state,
        error: action.payload.error,
      };
    }
    case types.CLEAR_CATEGORY_LIST: {
      return {
        ...state,
        categoryList: null,
        message: null,
        error: null,
      };
    }
    case types.CLEAR_CATEGORY: {
      return {
        ...state,
        category: null,
        message: null,
        error: null,
      };
    }
    case types.CLEAR_MESSAGE: {
      return {
        ...state,
        message: null,
      };
    }
    case types.CLEAR_ERROR: {
      return {
        ...state,
        error: null,
      };
    }

    default: {
      return state;
    }
  }
}
