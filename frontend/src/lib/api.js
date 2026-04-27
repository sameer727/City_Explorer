import axios from 'axios';

const TOKEN_KEY = 'token';

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses — clear the token so the app doesn't stay in a broken
// "logged in but token is expired" state that causes silent failures everywhere.
let _logoutCallback = null;

export function registerLogoutCallback(fn) {
  _logoutCallback = fn;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear it and trigger logout
      const token = localStorage.getItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      if (token && _logoutCallback) _logoutCallback();
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (payload) => api.post('/login', payload),
  register: (payload) => api.post('/register', payload)
};

export const cityApi = {
  list: () => api.get('/cities')
};

export const attractionApi = {
  list: (params) => api.get('/attractions', { params }),
  reviews: (id) => api.get(`/attractions/reviews/${id}`),
  addReview: (payload) => api.post('/attractions/review', payload),
  favorites: () => api.get('/attractions/favorites'),
  addFavorite: (attractionId) => api.post('/attractions/favorites', { attractionId }),
  removeFavorite: (attractionId) => api.delete(`/attractions/favorites/${attractionId}`)
};

export const messageApi = {
  submit: (payload) => api.post('/messages', payload),
  list: () => api.get('/messages')
};

export const hotelApi = {
  list: () => api.get('/hotels'),
  getById: (id) => api.get(`/hotels/${id}`),
  getByCity: (cityName) => api.get(`/hotels/city/${cityName}`),
  create: (formData) => api.post('/hotels', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.patch(`/hotels/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/hotels/${id}`)
};

export const bookingApi = {
  list: () => api.get('/bookings'),
  create: (payload) => api.post('/bookings', payload),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`)
};

export default api;
