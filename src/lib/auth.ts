import { JWTUtils, UserPayload } from './jwt';
import { prisma } from './db';

export class AuthService {
  static async register(email: string, password: string, name: string): Promise<{ user: UserPayload; token: string } | null> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await JWTUtils.hashPassword(password);

      // Create user
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
        },
      });

      // Generate token
      const userPayload: UserPayload = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      const token = JWTUtils.generateToken(userPayload);

      return { user: userPayload, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  static async login(email: string, password: string): Promise<{ user: UserPayload; token: string } | null> {
    try {
      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return null;
      }

      // Verify password
      const isValidPassword = await JWTUtils.comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        return null;
      }

      // Generate token
      const userPayload: UserPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      const token = JWTUtils.generateToken(userPayload);

      return { user: userPayload, token };
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  }

  static async getUserById(id: string): Promise<UserPayload | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: { id: true, email: true, name: true },
      });

      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  static verifyToken(token: string): UserPayload | null {
    return JWTUtils.verifyToken(token);
  }
}

