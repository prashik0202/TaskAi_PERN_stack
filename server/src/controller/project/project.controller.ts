import { ProjectService } from "../../service/project/project.service";
import { Request, Response } from "express";
import { ProjectCreate } from "../../types/types";

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
    this.createProject = this.createProject.bind(this);
    this.getProjectById = this.getProjectById.bind(this);
    this.getProjectsByUserId = this.getProjectsByUserId.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId; // Assuming user ID is set in the request object
      const projectData: ProjectCreate = req.body;

      if (!projectData.projectName || !projectData.description) {
        res.status(400).json({ error: "Please provide all required fields" });
        return;
      }

      const newProject = await this.projectService.creteProject(
        projectData,
        userId
      );
      res.status(201).json(newProject);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in create project controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async getProjectById(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      const project = await this.projectService.getProjectById(projectId);

      if (!project) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(200).json(project);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in get project by ID controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async getProjectsByUserId(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id; // Assuming user ID is set in the request object
      const projectsList =
        await this.projectService.getProjectsByUserId(userId);

      if (!projectsList || projectsList.length === 0) {
        res.status(404).json({ error: "No projects found for this user" });
        return;
      }

      res.status(200).json(projectsList);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error in get projects by user ID controller:",
          error.message
        );
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      const projectData = req.body;

      if (!projectData.projectName && !projectData.description) {
        res
          .status(400)
          .json({ error: "Please provide at least one field to update" });
        return;
      }

      const updatedProject = await this.projectService.updateProject(
        projectData,
        projectId
      );

      if (!updatedProject) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(200).json(updatedProject);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in update project controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      await this.projectService.deleteProject(projectId);
      res.status(204).send(); // No content
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in delete project controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async archiveProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.id;
      const archivedProject =
        await this.projectService.archiveProject(projectId);

      if (!archivedProject) {
        res.status(404).json({ error: "Project not found" });
        return;
      }

      res.status(200).json(archivedProject);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in archive project controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}
