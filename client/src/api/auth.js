// utils
import axios from '../utils/axios';

export const getUser = () => axios.get('/users');

export const loginUser = (user) => axios.post('/users/login', user);

export const registerUser = (user) => axios.post('/users', user);
