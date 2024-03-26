import axios from '../utils/axios';

export const getAllUsers = () => axios.get('/users/all');

export const getUserById = ({ userId }) => axios.get(`/users/${userId}`);

export const createUser = (user) => axios.post('/users', user);

export const updateUser = ({ userId, userData }) =>
  axios.post(`/users/user_update/${userId}`, userData);

export const deleteUser = (payload) =>
  axios.post(`/users/bulk/freeze`, {
    userIds: payload.userId,
    is_active: payload.is_active,
  });
