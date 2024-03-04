import axios from '../utils/axios';

export const getTotalCar = () => axios.get('/category/total');

export const getCar = () => axios.get('/car');

export const createCar = (payload) => axios.post(`/car`, payload);

export const updateCar = ({ carData, id }) => axios.put(`/car/${id}`, carData);

export const deleteCar = ({ carId }) => axios.delete(`/car/${carId}`);
