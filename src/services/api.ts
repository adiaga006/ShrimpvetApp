import axios from 'axios';

// API configuration
const API_URL = 'https://aquacultureintel.com/api.php';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Authentication APIs
export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}?action=login`, {
      username, 
      password // Không cần mã hóa MD5 ở đây, API sẽ thực hiện việc đó
    });
    return response.data;
  } catch (error) {
    console.error('Login API error:', error);
    throw error;
  }
};

// Test MySQL Login (biến thể khác nếu cách trên không hoạt động)
export const testMySQLLogin = async (username: string, password: string) => {
  try {
    console.log('Attempting login with:', { username, password: '***' });
    
    // Truyền tham số trực tiếp trong URL
    const response = await axios.get(`${API_URL}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
    
    console.log('Login response:', response.data);
    return response.data;
  } catch (error: any) {
    // Log chi tiết hơn
    console.error('MySQL login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    if (error.response) {
      throw { message: error.response.data.message || 'Server error', data: error.response.data };
    } else if (error.request) {
      throw { message: 'No response from server. Check your API URL and network connection.' };
    } else {
      throw { message: 'Error in request: ' + error.message };
    }
  }
};

// Test API connection
export const testConnection = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Test connection error:', error);
    throw error;
  }
};

// Get all users
export const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}?action=users`);
    return response.data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (id: number) => {
  try {
    const response = await axios.post(`${API_URL}?action=user`, { id });
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error;
  }
};

export default { login, testConnection, getUsers, getUserById, testMySQLLogin };