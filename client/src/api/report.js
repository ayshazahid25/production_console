import axios from '../utils/axios';

export const getAdminDasboard = () => axios.get('/check_in/admin-dashboard');

export const recordCheckIns = (payload) => axios.post(`/check_in`, payload);

export const getReportOfRemainingWorkingHours = () => axios.get(`/check_in/report`);
