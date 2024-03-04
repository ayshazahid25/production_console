import axios from '../utils/axios';

export const getCategory = () => axios.get('/category');

export const createCategory = (payload) => axios.post(`/category`, payload);

export const updateCategory = ({ id, name }) => axios.put(`/category/${id}`, { name });

export const deleteCategory = ({ categoryId }) => axios.delete(`/category/${categoryId}`);
