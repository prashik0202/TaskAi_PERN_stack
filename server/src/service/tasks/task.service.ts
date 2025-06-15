import { eq } from "drizzle-orm";
import db from "../../database";
import { Tasks, statusEnum } from "../../database/schema";
import { Task, TaskCreate, TaskUpdate } from "../../types/types";

export class TaskService {
  async createTask(
    projectId: string,
    TasksData: TaskCreate
  ): Promise<Task | undefined> {
    try {
      const newTask = await db
        .insert(Tasks)
        .values({
          ...TasksData,
          projectId: projectId,
        })
        .returning();

      return newTask[0] as Task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  // get all task by projectId
  async getAllTaskByProjectId(projectId: string): Promise<Task[] | undefined> {
    try {
      const tasks = await db
        .select()
        .from(Tasks)
        .where(eq(Tasks.projectId, projectId));
      console.log(tasks);
      return tasks as Task[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  // get task by taskId
  async getTaskById(taskId: string): Promise<Task | undefined> {
    try {
      const task = await db.select().from(Tasks).where(eq(Tasks.id, taskId));
      return task[0] as Task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async updateTask(
    taskId: string,
    TaskData: TaskUpdate
  ): Promise<Task | undefined> {
    try {
      const updatedTask = await db
        .update(Tasks)
        .set({
          ...TaskData,
          updatedAt: new Date(),
        })
        .where(eq(Tasks.id, taskId))
        .returning();

      return updatedTask[0] as Task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  // update task status
  async updateTaskStatus(
    taskId: string,
    taskStatus: (typeof statusEnum.enumValues)[number]
  ): Promise<Task | undefined> {
    try {
      const updatedTaskStatus = await db
        .update(Tasks)
        .set({
          status: taskStatus,
          updatedAt: new Date(),
        })
        .where(eq(Tasks.id, taskId))
        .returning();

      return updatedTaskStatus[0] as Task;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async deleteTask(taskId: string): Promise<void> {
    try {
      await db.delete(Tasks).where(eq(Tasks.id, taskId));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
