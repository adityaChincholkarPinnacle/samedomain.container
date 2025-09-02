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
    
    if (error instanceof Error && error.message === 'User already exists') {
      return res.status(409).json({ message: 'User already exists' });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}
