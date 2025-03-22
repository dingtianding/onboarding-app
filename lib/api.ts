import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

console.log('API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const createUser = async (userData: { email: string; password: string }) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: any) => {
  try {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Config API calls
export const getOnboardingConfig = async () => {
  try {
    const response = await api.get('/config');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching config:', error);
    // Return default config if API fails
    return {
      aboutMePage: 2,
      addressPage: 2,
      birthdatePage: 3
    };
  }
};

export const updateOnboardingConfig = async (configData: any) => {
  try {
    const response = await api.put('/config', configData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating config:', error);
    throw error;
  }
}; 