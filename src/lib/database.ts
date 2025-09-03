import { PrismaClient } from '@prisma/client';
import { supabase, supabaseAdmin } from './supabase';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Database operations using both Prisma and Supabase
export class DatabaseService {
  // Using Prisma (when direct DB connection works)
  static async createUserWithPrisma(userData: {
    email: string;
    name: string;
    passwordHash: string;
  }) {
    try {
      return await prisma.user.create({
        data: userData,
      });
    } catch (error) {
      console.error('Prisma error:', error);
      throw error;
    }
  }

  // Using Supabase (recommended for now)
  static async createUserWithSupabase(userData: {
    email: string;
    name: string;
    password_hash: string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert([userData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data[0];
  }

  // Get users using Supabase
  static async getUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return data;
  }

  // Get user by email using Supabase
  static async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching user:', error);
      throw error;
    }

    return data;
  }
}

export { prisma };
export default DatabaseService;
