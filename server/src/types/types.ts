import { users } from "../database/schema";

export type UserCreate = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;

export type Project = {
  id: string;
  projectName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isPublic: boolean;
  isArchived: boolean;
};

export type Task = {
  id: string;
  taskName: string;
  description: string;
  projectId: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type ProjectCreate = Omit<Project, "id" | "createdAt" | "updatedAt">;
export type ProjectSelect = Omit<Project, "userId"> & { user: UserSelect };
export type ProjectUpdate = Partial<
  Omit<Project, "id" | "createdAt" | "updatedAt">
>;

export type TaskCreate = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type TaskSelect = Omit<Task, "projectId"> & { project: ProjectSelect };
export type TaskUpdate = Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>;
