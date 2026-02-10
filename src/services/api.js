import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/me', data)
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`)
};

// Bookings API
export const bookingsAPI = {
    getAll: () => api.get('/bookings'),
    getAllAdmin: () => api.get('/bookings/all'),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (data) => api.post('/bookings', data),
    update: (id, data) => api.put(`/bookings/${id}`, data),
    delete: (id) => api.delete(`/bookings/${id}`)
};

// Queue API
export const queueAPI = {
    getStatus: () => api.get('/queue/status'),
    getMyToken: () => api.get('/queue/my-token'),
    callNext: (counterNumber) => api.post('/queue/call-next', { counterNumber }),
    serve: (id) => api.put(`/queue/${id}/serve`),
    getHistory: () => api.get('/queue/history')
};
export const menuAPI = {
    getAll: () => api.get('/menu'),
    toggleAvailability: (id, available) =>
        api.patch(`/menu/${id}/availability`, { available }),
    addItem: (data) => api.post('/menu', data),
    updateItem: (id, data) => api.put(`/menu/${id}`, data),
    deleteItem: (id) => api.delete(`/menu/${id}`)
};

// Slots API
export const slotsAPI = {
    getAll: () => api.get('/slots'),
    getToday: () => api.get('/slots/today'),
    getById: (id) => api.get(`/slots/${id}`),
    create: (data) => api.post('/slots', data),
    update: (id, data) => api.put(`/slots/${id}`, data),
    delete: (id) => api.delete(`/slots/${id}`),
    generate: (data) => api.post('/slots/generate', data)
};

// Forecasts API
export const forecastsAPI = {
    getToday: () => api.get('/forecasts/today'),
    getWeek: () => api.get('/forecasts/week'),
    getAll: () => api.get('/forecasts'),
    getAccuracy: (days = 30) => api.get(`/forecasts/accuracy?days=${days}`),
    predict: (data) => api.post('/forecasts/predict', data),
    updateActual: (id, actualDemand) => api.put(`/forecasts/${id}/actual`, { actualDemand }),
    recordActualFromBookings: (date, mealType) => api.post('/forecasts/record-actual', { date, mealType })
};

// Waste API
export const wasteAPI = {
    getAll: (params = {}) => api.get('/waste', { params }),
    getSummary: (days = 30) => api.get(`/waste/summary?days=${days}`),
    create: (data) => api.post('/waste', data),
    update: (id, data) => api.put(`/waste/${id}`, data),
    delete: (id) => api.delete(`/waste/${id}`)
};

// Sustainability API
export const sustainabilityAPI = {
    getMetrics: () => api.get('/sustainability/metrics'),
    getReport: () => api.get('/sustainability/report')
};

// Preparation API
export const preparationAPI = {
    getRecommendations: (date) => api.get(`/preparation/recommendations${date ? `?date=${date}` : ''}`)
};

// Analytics API
export const analyticsAPI = {
    getDashboard: () => api.get('/analytics/dashboard'),
    getWasteReport: () => api.get('/analytics/waste-report'),
    getDemandTrends: () => api.get('/analytics/demand-trends'),
    getSummary: () => api.get('/analytics/summary')
};

// Incentives API
export const incentivesAPI = {
    // User endpoints
    getMyPoints: () => api.get('/incentives/my-points'),
    getHistory: () => api.get('/incentives/my-history'),
    getStatus: () => api.get('/incentives/status'),

    // Admin endpoints
    getRules: () => api.get('/incentives/rules'),
    createRule: (data) => api.post('/incentives/rules', data),
    updateRule: (id, data) => api.put(`/incentives/rules/${id}`, data),
    deleteRule: (id) => api.delete(`/incentives/rules/${id}`),
    getAbuseReport: () => api.get('/incentives/abuse-report'),
    applyToSlots: () => api.post('/incentives/apply-to-slots')
};

// Addons API
export const addonsAPI = {
    // User endpoints
    getAll: () => api.get('/addons'),
    redeem: (id) => api.post(`/addons/${id}/redeem`),
    getMyRedemptions: () => api.get('/addons/my-redemptions'),

    // Admin endpoints
    create: (data) => api.post('/addons', data),
    update: (id, data) => api.put(`/addons/${id}`, data),
    delete: (id) => api.delete(`/addons/${id}`),
    claim: (code) => api.post('/addons/claim', { code })
};

export default api;


