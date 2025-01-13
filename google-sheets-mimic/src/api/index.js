import axios from 'axios';

// Set up the base URL for your API (assuming backend is running on localhost:3001)
const api = axios.create({
  baseURL: 'http://localhost:3001/', // Update if your backend has a different URL
});

// Test GET request to check if backend is working
export const testBackendConnection = async () => {
  try {
    const response = await api.get('/');
    console.log('Backend response:', response.data);
  } catch (error) {
    console.error('Error connecting to backend:', error);
  }
};

export default api;
