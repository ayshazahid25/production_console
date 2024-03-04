import * as types from './index';

// send the request to fetch all car
export const getCarRequest = () => ({
  type: types.GET_CAR_REQUEST,
});
// sending the data to redux store of all car
export const getCarSuccess = ({ items }) => ({
  type: types.GET_CAR_SUCCESS,
  payload: {
    items,
  },
});

// send the request to fetch all category
export const getTotalCarRequest = () => ({
  type: types.GET_TOTAL_CAR_REQUEST,
});

// sending the data to redux store of all category
export const getTotalCarSuccess = ({ items }) => ({
  type: types.GET_TOTAL_CAR_SUCCESS,
  payload: {
    items,
  },
});

// send the request to fetch car by id
export const getCarByIdRequest = (carId) => ({
  type: types.GET_CAR_BY_ID_REQUEST,
  payload: {
    carId,
  },
});

// sending the data to redux store of the car
export const getCarByIdSuccess = ({ carDetails }) => ({
  type: types.GET_CAR_BY_ID_SUCCESS,
  payload: {
    carDetails,
  },
});

export const createCarRequest = (data) => ({
  type: types.CREATE_CAR_REQUEST,
  payload: {
    ...data,
  },
});

export const createCarSuccess = ({ message }) => ({
  type: types.CREATE_CAR_SUCCESS,
  payload: {
    message,
  },
});

export const updateCarRequest = ({ carData, id }) => ({
  type: types.UPDATE_CAR_REQUEST,
  payload: {
    carData,
    id,
  },
});

export const updateCarSuccess = ({ message }) => ({
  type: types.UPDATE_CAR_SUCCESS,
  payload: {
    message,
  },
});

export const deleteCarRequest = (carId) => ({
  type: types.DELETE_CAR_REQUEST,
  payload: {
    carId,
  },
});

export const deleteCarSuccess = ({ message }) => ({
  type: types.DELETE_CAR_SUCCESS,
  payload: {
    message,
  },
});

export const carError = ({ error }) => ({
  type: types.CAR_ERROR,
  payload: {
    error,
  },
});

export const clearCarList = () => ({
  type: types.CLEAR_CAR_LIST,
});

export const clearTotalCars = () => ({
  type: types.CLEAR_TOTAL_CARS,
});

export const clearCar = () => ({
  type: types.CLEAR_CAR,
});

export const clearMessage = () => ({
  type: types.CLEAR_MESSAGE,
});

export const clearError = () => ({
  type: types.CLEAR_ERROR,
});
