import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://mys-backend-de75ad11f796.herokuapp.com/api',
});

export default axiosInstance;
