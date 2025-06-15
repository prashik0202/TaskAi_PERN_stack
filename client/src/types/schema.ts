import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Please proivde name" })
    .max(20, { message: "name is too long" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, { message: "Please enter password" })
    .max(8, { message: "Not more than 8 character" }),
});
export type UserSchemaType = z.infer<typeof userSchema>;

export const userSignInSchema = userSchema.omit({ name: true });
export type UserSignInSchemaType = z.infer<typeof userSignInSchema>;

export const userUpdateSchema = userSchema.omit({ password: true });
export type UserUpdateType = z.infer<typeof userUpdateSchema>;

export const ProjectSchema = z.object({
  projectName: z
    .string()
    .min(1, { message: "Please enter project name" })
    .max(20, { message: "Project name is too long!" }),
  description: z
    .string()
    .min(1, { message: "Please enter description" })
    .max(60, { message: "max 60 character allowed" }),
});

export type ProjectSchemaType = z.infer<typeof ProjectSchema>;

export const TaskSchema = z.object({
  taskName: z
    .string()
    .min(1, { message: "Please provide taskName" })
    .max(20, { message: "taskname is too long!" }),
  description: z
    .string()
    .min(1, { message: "Please provide task Description" })
    .max(100, { message: "Please provide short descipton of your task" }),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.coerce.date({ required_error : "DueDate is required!"})
});

export type TaskSchemaType = z.infer<typeof TaskSchema>;
