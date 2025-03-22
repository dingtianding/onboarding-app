import axios from 'axios';

// Get the API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

console.log('API URL:', API_URL); // Debug log

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API calls
export const createUser = async (userData: any) => {
  try {
    console.log('API URL:', API_URL);
    console.log('Attempting to create user with:', userData);
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await axios.put(`${API_URL}/users/${userId}`, userData);
  return response.data;
};

export const getUserById = async (userId: string) => {
  const response = await axios.get(`${API_URL}/users/${userId}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

// Config API calls
export const getOnboardingConfig = async () => {
  const response = await axios.get(`${API_URL}/config`);
  return response.data;
};

export const updateOnboardingConfig = async (configData: any) => {
  const response = await axios.put(`${API_URL}/config`, configData);
  return response.data;
}; 