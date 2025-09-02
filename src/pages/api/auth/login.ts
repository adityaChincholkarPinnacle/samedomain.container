import { NextApiRequest, NextApiResponse } from 'next';
import { AuthService } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Login user
    const result = await AuthService.login(email, password);

    if (!result) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', `token=${result.token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict`);

    return res.status(200).json({
      message: 'Login successful',
      user: result.user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
