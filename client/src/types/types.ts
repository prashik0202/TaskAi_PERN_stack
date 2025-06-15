export type User = {
  id: string;
  email: string;
  name: string;
};

export interface ErrorResponse {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

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

export type Column = {
  id: string;
  columnName: string;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
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

export type CreateTaskType = Omit<
  Task,
  "id" | "projectId" | "createdAt" | "updatedAt"
>;
export type UpdateTaskType = CreateTaskType;
