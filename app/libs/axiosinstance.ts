const axios = require('axios');

// Create an Axios instance with default configuration
export const axiosinstance = axios.create({
    baseURL: 'https://example.com/api', // Adjust the base URL according to your API
    timeout: 120000, // Set a timeout if needed
});

// Add a request interceptor
axiosinstance.interceptors.request.use(
    async(config: any) => {
        // Add headers dynamically before the request is sent
        const token =await getAuthToken()
        config.headers['Authorization'] = token
        // You can add other headers dynamically here if needed
        return config;
    },
    (error: any) => {
        // Handle request error
        return Promise.reject(error);
    }
);

// Example function to get the authentication token dynamically
async function getAuthToken() {
    const token = await localStorage.getItem('token')
    return token;
}
