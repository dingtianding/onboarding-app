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

// Set up axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

// Add request interceptor for debugging
axios.interceptors.request.use(request => {
  console.log('API Request:', request.method, request.url);
  return request;
});

// User API calls
export const registerUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    console.log('API URL:', API_URL);
    console.log('Attempting to register user with:', { email, password: '***' });
    
    const response = await axios.post(`${API_URL}/users`, { email, password });
    console.log('User registration response:', response.data);
    
    // Return the data in the expected format
    return {
      message: 'User registered successfully',
      user: response.data // The user object is directly in the response data
    };
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Check if it's an axios error with a response
    if (axios.isAxiosError(error) && error.response) {
      console.log('User registration error response:', error.response.data);
      throw { response: { data: { message: error.response.data.message || 'Failed to register user' } } };
    }
    
    // For other errors
    throw { response: { data: { message: 'Failed to register user' } } };
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

export async function clearDatabase() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/clear-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Clear database endpoint not found. Please implement it on the backend.');
      }
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || 'Failed to clear database');
    }
    
    return response.json();
  } catch (error) {
    console.error('Clear database error:', error);
    throw error;
  }
}

// Add this helper function at the top of your api.ts file
function logApiRequest(method, url, body = null) {
  console.log(`🔍 API ${method} Request to: ${url}`);
  if (body) console.log('Request body:', body);
}

export const loginUser = async ({ email, password }: { email: string; password: string }) => {
  try {
    console.log('API URL:', API_URL);
    console.log('Attempting to login with:', { email, password: '***' });
    
    const response = await axios.post(`${API_URL}/users/login`, { email, password });
    console.log('Login response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    
    // Check if it's an axios error with a response
    if (axios.isAxiosError(error) && error.response) {
      console.log('Login error response:', error.response.data);
      
      // Pass through the specific error message
      throw { 
        response: { 
          data: { 
            message: error.response.data.message || 'Login failed',
            status: error.response.status
          } 
        } 
      };
    }
    
    // For other errors
    throw { response: { data: { message: 'Login failed' } } };
  }
};

export async function createUser({ email, password }: { email: string; password: string }) {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/users`;
  console.log('Create user URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    console.log('Create user response status:', response.status);
    
    // Get response as text first
    const responseText = await response.text();
    
    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error('Invalid server response');
    }
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create user');
    }
    
    return data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
} 