import { Request, Response } from "express";
import { TaskService } from "../../service/tasks/task.service";
import { TaskCreate, TaskUpdate } from "../../types/types";
import { statusEnum } from "../../database/schema";

export class TaskController {
  private TaskService: TaskService;

  constructor() {
    this.TaskService = new TaskService();
    this.createTask = this.createTask.bind(this);
    this.getTasksByProjectId = this.getTasksByProjectId.bind(this);
    this.getTask = this.getTask.bind(this);
    this.updateTaskById = this.updateTaskById.bind(this);
    this.updateTaskStatus = this.updateTaskStatus.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId;
      const TaskData: TaskCreate = req.body;

      if (!projectId || !TaskData) {
        res.status(400).json({
          error: "Please provide all required fields",
        });
        return;
      }

      const parsedDueDate = new Date(TaskData.dueDate);

      if (isNaN(parsedDueDate.getTime())) {
        throw new Error("Invalid dueDate format");
      }

      const newTask = await this.TaskService.createTask(projectId, {
        ...TaskData,
        dueDate: parsedDueDate,
      });

      res.status(201).json(newTask);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in creating task controller : ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async getTasksByProjectId(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId;

      if (!projectId) {
        res.status(400).json({
          error: "Please provide all required fields",
        });
        return;
      }

      const tasks = await this.TaskService.getAllTaskByProjectId(projectId);

      res.status(200).json(tasks);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error in gettong task by projectId controller : ",
          error.message
        );
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;

      if (!taskId) {
        res.status(400).json({
          error: "Please provide fields",
        });
        return;
      }

      const task = await this.TaskService.getTaskById(taskId);

      res.status(200).json(task);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error in getting task by taskId controller : ",
          error.message
        );
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async updateTaskById(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;
      const taskData: TaskUpdate = req.body;

      if (!taskId || !taskData) {
        res.status(400).json({
          error: "Please provide all required fields",
        });
        return;
      }

      if (typeof taskData.dueDate === "undefined") {
        throw new Error("dueDate is required");
      }

      const parsedDueDate = new Date(taskData.dueDate);

      if (isNaN(parsedDueDate.getTime())) {
        throw new Error("Invalid dueDate format");
      }

      const updatedTask = await this.TaskService.updateTask(taskId, {
        ...taskData,
        dueDate: parsedDueDate,
      });

      res.status(201).json(updatedTask);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in updating task contorller : ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;
      const taskStatus: { status: (typeof statusEnum.enumValues)[number] } =
        req.body;

      if (!taskId || !taskStatus) {
        res.status(400).json({
          error: "Please provide all required fields",
        });
        return;
      }

      const updatedTask = await this.TaskService.updateTaskStatus(
        taskId,
        taskStatus.status
      );

      res.status(200).json(updatedTask);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          "Error in updating taskstatus contorller : ",
          error.message
        );
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }

  async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const taskId = req.params.taskId;

      if (!taskId) {
        res.status(400).json({
          error: "Please provide required fields",
        });
        return;
      }

      await this.TaskService.deleteTask(taskId);

      res.json(200).json({
        message: "task Deleted successfully!",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error in Deleting task controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }
}
