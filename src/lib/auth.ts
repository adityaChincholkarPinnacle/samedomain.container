import { JWTUtils, UserPayload } from './jwt';
import { supabaseAdmin } from './supabase';

export class AuthService {
  static async register(email: string, password: string, name: string): Promise<{ user: UserPayload; token: string } | null> {
    try {
      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      // If user exists (no error and data found)
      if (existingUser && !checkError) {
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await JWTUtils.hashPassword(password);

      // Create user
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert([{
          email,
          name,
          password_hash: hashedPassword,
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

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
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        return null;
      }

      // Verify password
      const isValidPassword = await JWTUtils.comparePassword(password, user.password_hash);
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
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, email, name')
        .eq('id', id)
        .single();

      if (error || !user) {
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

