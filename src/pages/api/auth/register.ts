import { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Register user
    const result = await AuthService.register(email, password, name);

    if (!result) {
      return res.status(400).json({ message: 'Registration failed' });
    }

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `token=${result.token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`);

    return res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Conflict for existing user
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(409).json({ message: 'User already exists' });
    }

    // In development, surface more error details to aid debugging
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
      type ErrInfo = {
        message?: string;
        name?: string;
        code?: unknown;
        details?: unknown;
        hint?: unknown;
      };

      const info: ErrInfo = {};
      if (error instanceof Error) {
        info.message = error.message;
        info.name = error.name;
      }
      if (typeof error === 'object' && error !== null) {
        const e = error as Record<string, unknown>;
        if (e.code !== undefined) info.code = e.code;
        if (e.details !== undefined) info.details = e.details;
        if (e.hint !== undefined) info.hint = e.hint;
      }

      return res.status(500).json({
        message: 'Internal server error',
        error: info,
      });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}
