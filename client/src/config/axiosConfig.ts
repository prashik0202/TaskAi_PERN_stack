import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response.status === 401) {
      // Handle unauthorized access, e.g., redirect to login
      localStorage.removeItem("persist:user");
      window.location.href = "/sign-in";
    }
    console.error("Error in Axios response:", error);
    throw error;
  }
);
