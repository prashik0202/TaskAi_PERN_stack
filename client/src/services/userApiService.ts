import { axiosInstance } from "@/config/axiosConfig";
import type { ErrorResponse, User } from "@/types/types";
import { AxiosError, type AxiosResponse } from "axios";

export const userApiService = {
  signInUser: async (
    UserData: Pick<User, "email"> & { password: string }
  ): Promise<AxiosResponse<User>> => {
    try {
      const response = await axiosInstance.post("/api/user/signin", UserData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) throw error;
      // Handle non-Axios errors (e.g., network errors, unexpected issues)
      throw {
        message: "An unexpected error occurred",
        status: 500,
      } as ErrorResponse;
    }
  },

  signUpUser: async (
    userData: Pick<User, "email" | "name"> & { password: string }
  ): Promise<AxiosResponse<User>> => {
    try {
      const response = await axiosInstance.post("/api/user/signup", userData);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) throw error;
      // Handle non-Axios errors (e.g., network errors, unexpected issues)
      throw {
        message: "An unexpected error occurred",
        status: 500,
      } as ErrorResponse;
    }
  },

  getUser: async (): Promise<AxiosResponse<User>> => {
    try {
      const response = await axiosInstance.get("/api/user/me");
      return response;
    } catch (error) {
      if (error instanceof AxiosError) throw error;
      // Handle non-Axios errors (e.g., network errors, unexpected issues)
      throw {
        message: "An unexpected error occurred",
        status: 500,
      } as ErrorResponse;
    }
  },

  logout: async (): Promise<AxiosResponse<{ message: string }>> => {
    try {
      const response = await axiosInstance.post("/api/user/logout");
      return response;
    } catch (error) {
      if (error instanceof AxiosError) throw error;
      // Handle non-Axios errors (e.g., network errors, unexpected issues)
      throw {
        message: "An unexpected error occurred",
        status: 500,
      } as ErrorResponse;
    }
  },

  updateUserData: async (
    userData: Pick<User, "email" | "name">,
    userId: string
  ): Promise<AxiosResponse<User>> => {
    try {
      const response = await axiosInstance.put(
        `/api/user/update/${userId}`,
        userData
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) throw error;
      // Handle non-Axios errors (e.g., network errors, unexpected issues)
      throw {
        message: "An unexpected error occurred",
        status: 500,
      } as ErrorResponse;
    }
  },
};
