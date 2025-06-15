import { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import { UserCreate, UserSelect } from "../../types/types";
import { AuthService } from "../../service/auth/auth.service";
import { generateToken } from "../../utils/generateToken";

export class UserController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);
    this.getUser = this.getUser.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.logout = this.logout.bind(this);
  }

  async signUp(req: Request, res: Response): Promise<void> {
    try {
      // get request body
      const { name, email, password } = req.body as UserCreate;

      if (!name || !email || !password) {
        res.status(400).json({
          error: "Please provide all fields",
        });
        return;
      }

      const user = await this.authService.getUserByEmail(email);
      if (user) {
        res.status(400).json({
          message: "User already exists",
        });
        return;
      }

      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      const newUser = await this.authService.createUser({
        email,
        password: hashedPassword,
        name,
      });

      if (newUser && newUser.id) {
        // generate token
        generateToken(newUser.id, res);

        res.status(201).json(newUser);
      } else {
        res.status(400).json({
          error: "Invalid User Data",
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
          error: "Internal Server Error",
        });
      }
    }
  }

  async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as Omit<UserCreate, "name">;

      if (!email || !password) {
        res.status(400).json({
          message: "Please provide required fields",
        });
        return;
      }

      const user = await this.authService.getUserByEmail(email);

      if (!user) {
        res.status(400).json({
          message: "Invalid credentials!",
        });
        return;
      }

      const isPasswordCorrect = await bcryptjs.compare(password, user.password);

      if (!isPasswordCorrect) {
        res.status(400).json({
          message: "Incorrect Password!",
        });
      }

      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password: Password, ...rest } = user as UserSelect;

      generateToken(user.id, res);

      res.status(200).json(rest);
    } catch (error) {
      if (error instanceof Error) {
        console.log("Error in signin controller", error.message);
        res.status(500).json({
          error: "Internal Server Error",
        });
      }
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.authService.getUserById(req.user.id);

      if (!user) {
        res.status(404).json({
          error: "User not found",
        });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        res.status(500).json({
          error: "Internal server error",
        });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body as UserCreate;
      const userId = req.params.userId;

      const userExists = await this.authService.getUserById(userId);
      if (!userExists) {
        res.status(404).json({
          error: "User does not exists",
        });
        return;
      }

      const updatedUser = await this.authService.updateUser(
        { name, email },
        userId
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        res.status(500).json({
          error: "Internal server error",
        });
      }
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.cookie("token", "", { maxAge: 0 });
      res.status(200).json({
        message: "Logged out successfully!",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        res.status(500).json({
          error: "Internal server error",
        });
      }
    }
  }
}
