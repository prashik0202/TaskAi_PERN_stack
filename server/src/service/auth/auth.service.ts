import { eq } from "drizzle-orm";
import db from "../../database";
import { users } from "../../database/schema";
import { UserCreate, UserSelect } from "../../types/types";

export class AuthService {
  async createUser(
    userData: UserCreate
  ): Promise<Omit<UserCreate, "password"> | undefined> {
    try {
      const newUser = await db
        .insert(users)
        .values({
          email: userData.email,
          name: userData.name,
          password: userData.password,
        })
        .returning();

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password, ...safeUser } = newUser[0] as UserSelect;

      return safeUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getUserByEmail(userEmail: string): Promise<UserSelect | undefined> {
    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.email, userEmail));
      return user[0];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getUserById(
    userId: string
  ): Promise<Omit<UserSelect, "password"> | undefined> {
    try {
      const user = await db.select().from(users).where(eq(users.id, userId));

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password, ...rest } = user[0];

      return rest;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async updateUser(
    userData: Partial<UserSelect>,
    userId: string
  ): Promise<Omit<UserSelect, "password"> | undefined> {
    try {
      const updatedUser = await db
        .update(users)
        .set({
          email: userData.email,
          name: userData.name,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password, ...rest } = updatedUser[0];

      return rest;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
