import { and, eq } from "drizzle-orm";
import db from "../../database";
import { projects } from "../../database/schema";
import { ProjectCreate, ProjectSelect, ProjectUpdate } from "../../types/types";

export class ProjectService {
  async creteProject(
    projectData: ProjectCreate,
    userId: string
  ): Promise<ProjectSelect | undefined> {
    try {
      const newProject = await db
        .insert(projects)
        .values({
          ...projectData,
          userId: userId,
        })
        .returning();

      return newProject[0] as unknown as ProjectSelect;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getProjectById(projectId: string): Promise<ProjectSelect | undefined> {
    try {
      const project = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectId));
      return project[0] as unknown as ProjectSelect;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getProjectsByUserId(
    userId: string
  ): Promise<ProjectSelect[] | undefined> {
    try {
      const projectsList = await db
        .select()
        .from(projects)
        .where(eq(projects.userId, userId));
      return projectsList as unknown as ProjectSelect[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async updateProject(
    projectData: Partial<ProjectUpdate>,
    projectId: string
  ): Promise<ProjectSelect | undefined> {
    try {
      const updatedProject = await db
        .update(projects)
        .set({
          ...projectData,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId))
        .returning();

      return updatedProject[0] as unknown as ProjectSelect;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      await db.delete(projects).where(eq(projects.id, projectId)).returning();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async archiveProject(projectId: string): Promise<ProjectSelect | undefined> {
    try {
      const archivedProject = await db
        .update(projects)
        .set({
          isArchived: true,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId))
        .returning();

      return archivedProject[0] as unknown as ProjectSelect;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async unarchiveProject(
    projectId: string
  ): Promise<ProjectSelect | undefined> {
    try {
      const unarchivedProject = await db
        .update(projects)
        .set({
          isArchived: false,
          updatedAt: new Date(),
        })
        .where(eq(projects.id, projectId))
        .returning();

      return unarchivedProject[0] as unknown as ProjectSelect;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getPublicProjects(): Promise<ProjectSelect[] | undefined> {
    try {
      const publicProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.isPublic, true));
      return publicProjects as unknown as ProjectSelect[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getArchivedProjectsByUserId(
    userId: string
  ): Promise<ProjectSelect[] | undefined> {
    try {
      const archivedProjects = await db
        .select()
        .from(projects)
        .where(and(eq(projects.userId, userId), eq(projects.isArchived, true)));
      return archivedProjects as unknown as ProjectSelect[];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
