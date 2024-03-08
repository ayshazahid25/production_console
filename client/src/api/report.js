import axios from '../utils/axios';

export const getAdminDasboard = () => axios.get('/check_in/admin-dashboard');
