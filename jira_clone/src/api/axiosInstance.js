import axios from 'axios';

const api  = axios.create({
    baseURL: '/api',
    withCredentials:true
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(
            originalRequest &&
            error.response?.status === 401 && 
            !originalRequest._retry &&
            !originalRequest.skipAuthRefresh &&
            !originalRequest.url.includes('/refresh') &&
            !originalRequest.url.includes('/login')
        ){
            originalRequest._retry = true;

            try{
                await api.post('/refresh');
                return api(originalRequest);
            } catch (refreshError) {
                if(window.location.pathname !== '/login'){
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
