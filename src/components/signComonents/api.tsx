import axios, { AxiosResponse, AxiosError } from 'axios';
import { useRouter } from 'next/router';

interface CustomError extends AxiosError {
  isHandled?: boolean;
}

const axiosApi = axios.create({
  baseURL: 'http://10.11.7.6:3000', // Adjust this as per your server setup
});


axiosApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: CustomError) => {
    console.log('response', error.response  )
    if (error.response) {
      
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          if (window && window.location.pathname !== '/login')
          window.location.href = "/login";// Ensure your app's routing logic handles this smoothly
          error.isHandled = true;
          break;
        case 400:
          // Handle bad requests, possibly by showing a user-friendly error message
          console.log('A bad request error occurred:', error.response.data);
          error.isHandled = true;  // This prevents further propagation in your promise chain
          break;
        default:
          // Handle other errors appropriately
          break;
      }
    }
    if (error.isHandled) {
      // Return an empty resolved promise to swallow the error
      return Promise.resolve();
    }
    // For errors that are not handled above, you might still want to throw them
    return Promise.resolve();
  }
  
);

export default axiosApi;