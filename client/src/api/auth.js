// utils
import axios from '../utils/axios';

export const getUser = () => axios.get('/users');

export const updateUserProfile = ({ userId, formData }) =>
  axios.post(`/users/update_profile/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const loginUser = (user) => axios.post('/users/login', user);
