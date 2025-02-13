import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getAvailableSlots = () => api.get('/slots');
export const bookAppointment = (data) => api.post('/appointments', data);
export const getAppointments = (userId) => api.get(`/appointments/${userId}`);
export const cancelAppointment = (appointmentId) => api.delete(`/appointments/${appointmentId}`);
