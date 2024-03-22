import axios from '../utils/axios';

export const getAllUsers = () => axios.get('/users/all');

export const getUserById = ({ userId }) => axios.get(`/users/${userId}`);

export const updateUser = ({ userId, formData }) =>
  axios.post(`/users/user_update/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deleteUser = (payload) =>
  axios.post(`/users/bulk/freeze`, {
    userIds: payload.userId,
    is_active: payload.is_active,
  });
