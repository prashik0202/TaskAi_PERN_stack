import { axiosInstance } from "@/config/axiosConfig";
import type { TaskSchemaType } from "@/types/schema";
import type { Task, UpdateTaskType } from "@/types/types";
import { AxiosError, type AxiosResponse } from "axios";

export const taskService = {
  getTaskByofExercise: async (
    projectId: string
  ): Promise<AxiosResponse<Task[]>> => {
    try {
      const response = await axiosInstance.get(`/api/tasks/${projectId}`);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message || `Error : ${error.message}`);
      }
      // non axios Error
      throw new Error("An unexpected error occured!");
    }
  },

  getTask: async (taskId: string): Promise<AxiosResponse<Task>> => {
    try {
      const response = await axiosInstance.get(`/api/tasks/${taskId}/task`);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message || `Error : ${error.message}`);
      }
      // non axios Error
      throw new Error("An unexpected error occured!");
    }
  },

  updateTask: async (
    taskId: string,
    updatedTaskDetails: UpdateTaskType
  ): Promise<AxiosResponse<Task>> => {
    try {
      const response = await axiosInstance.put(
        `/api/tasks/${taskId}/update`,
        updatedTaskDetails
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message || `Error: ${error.message}`);
      }
      throw new Error("An unexpected error occured!");
    }
  },

  updateTaskStatus: async (
    taskId: string,
    taskStatus: Task["status"]
  ): Promise<AxiosResponse<Task>> => {
    try {
      const response = await axiosInstance.patch(`/api/tasks/${taskId}`, {
        status: taskStatus,
      });
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message || `Error: ${error.message}`);
      }
      throw new Error("An unexpected error occured!");
    }
  },

  createTask: async (
    projecctId: string,
    taskDetails: TaskSchemaType
  ): Promise<AxiosResponse<Task>> => {
    try {
      const response = await axiosInstance.post(
        `/api/tasks/${projecctId}`,
        taskDetails
      );
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message || `Error: ${error.message}`);
      }
      throw new Error("An unexpected error occured!");
    }
  },

  deleteTask: async (taskId: string): Promise<AxiosResponse<void>> => {
    try {
      const response = await axiosInstance.delete(`/api/tasks/${taskId}`);
      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message || `Error: ${error.message}`);
      }
      throw new Error("An unexpected error occured!");
    }
  },
};
