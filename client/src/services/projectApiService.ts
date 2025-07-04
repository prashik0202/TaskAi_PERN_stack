import { axiosInstance } from "@/config/axiosConfig";
import type { Project } from "@/types/types";
import type { AxiosResponse } from "axios";

export const projectApiService = {
  getProjectsOfUser: async (
    userId: string
  ): Promise<AxiosResponse<Project[]>> => {
    try {
      const response = await axiosInstance.get(`/api/project/user/${userId}`);
      return response;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  getProjectById: async (
    projectId: string
  ): Promise<AxiosResponse<Project>> => {
    try {
      const response = await axiosInstance.get(`/api/project/${projectId}`);
      return response;
    } catch (error) {
      console.error("Error fetching project", error);
      throw error;
    }
  },

  createProject: async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<AxiosResponse<Project>> => {
    try {
      const response = await axiosInstance.post(
        `/api/project/${projectData.userId}`,
        projectData
      );
      return response;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  updateProject: async (
    updatedProjectData: Partial<Project>
  ): Promise<AxiosResponse<Project>> => {
    try {
      const response = await axiosInstance.put(
        `/api/project/${updatedProjectData.id}`,
        updatedProjectData
      );
      return response;
    } catch (error) {
      console.log("Error while updating project Details", error);
      throw error;
    }
  },

  deleteProject: async (projectId: string): Promise<AxiosResponse<void>> => {
    try {
      const response = await axiosInstance.delete(`/api/project/${projectId}`);
      return response;
    } catch (error) {
      console.log("Error while deleting project", error);
      throw error;
    }
  },
};
