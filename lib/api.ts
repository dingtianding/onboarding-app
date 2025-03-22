import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const createUser = async (userData: { email: string; password: string }) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Config API calls
export const getOnboardingConfig = async () => {
  const response = await api.get('/config');
  return response.data;
};

export const updateOnboardingConfig = async (configData: {
  aboutMePage: number;
  addressPage: number;
  birthdatePage: number;
}) => {
  const response = await api.put('/config', configData);
  return response.data;
}; 