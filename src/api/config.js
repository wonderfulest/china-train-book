export const getApiConfig = () => {
  console.log('Current Mode:', import.meta.env.MODE);
  console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('API Timeout:', import.meta.env.VITE_API_TIMEOUT);
  
  return {
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT)
  };
};
