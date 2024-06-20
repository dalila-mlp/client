import axios from 'axios';
import { getCookie } from '../../middleware/auth';

const instance = axios.create({baseURL: 'http://localhost'});

instance.interceptors.request.use(
    (config) => {
        const token = getCookie('token');
        if (token) config.headers['Authorization'] = `Bearer ${token}`;

        return config;
    },
    (error) => Promise.reject(error),
);

export default instance;
