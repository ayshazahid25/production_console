import * as types from './index';

// send the request to fetch all category
export const getCategoryRequest = () => ({
  type: types.GET_CATEGORY_REQUEST,
});
// sending the data to redux store of all category
export const getCategorySuccess = ({ items }) => ({
  type: types.GET_CATEGORY_SUCCESS,
  payload: {
    items,
  },
});

// send the request to fetch all category
export const getTotalCategoryRequest = () => ({
  type: types.GET_TOTAL_CATEGORY_REQUEST,
});

// sending the data to redux store of all category
export const getTotalCategorySuccess = ({ items }) => ({
  type: types.GET_TOTAL_CATEGORY_SUCCESS,
  payload: {
    items,
  },
});

// send the request to fetch category by id
export const getCategoryByIdRequest = (categoryId) => ({
  type: types.GET_CATEGORY_BY_ID_REQUEST,
  payload: {
    categoryId,
  },
});

// sending the data to redux store of the category
export const getCategoryByIdSuccess = ({ categoryDetails }) => ({
  type: types.GET_CATEGORY_BY_ID_SUCCESS,
  payload: {
    categoryDetails,
  },
});

export const createCategoryRequest = (name) => ({
  type: types.CREATE_CATEGORY_REQUEST,
  payload: name,
});

export const createCategorySuccess = ({ message }) => ({
  type: types.CREATE_CATEGORY_SUCCESS,
  payload: {
    message,
  },
});

export const updateCategoryRequest = (data) => ({
  type: types.UPDATE_CATEGORY_REQUEST,
  payload: {
    ...data,
  },
});

export const updateCategorySuccess = ({ message }) => ({
  type: types.UPDATE_CATEGORY_SUCCESS,
  payload: {
    message,
  },
});

export const deleteCategoryRequest = (categoryId) => ({
  type: types.DELETE_CATEGORY_REQUEST,
  payload: {
    categoryId,
  },
});

export const deleteCategorySuccess = ({ message }) => ({
  type: types.DELETE_CATEGORY_SUCCESS,
  payload: {
    message,
  },
});

export const categoryError = ({ error }) => ({
  type: types.CATEGORY_ERROR,
  payload: {
    error,
  },
});

export const clearCategoryList = () => ({
  type: types.CLEAR_CATEGORY_LIST,
});

export const clearCategory = () => ({
  type: types.CLEAR_CATEGORY,
});

export const clearMessage = () => ({
  type: types.CLEAR_MESSAGE,
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
});
