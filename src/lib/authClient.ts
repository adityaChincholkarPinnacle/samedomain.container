import { UserPayload } from './jwt';

class AuthClient {
  private user: UserPayload | null = null;
  private loading: boolean = true;
  private listeners: Array<() => void> = [];

  constructor() {
    // Only run checkAuth on client side
    if (typeof window !== 'undefined') {
      this.checkAuth();
    } else {
      this.loading = false;
    }
  }

  private async checkAuth() {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
      } else {
        this.user = null;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      this.user = null;
    } finally {
      this.loading = false;
      this.notifyListeners();
    }
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        this.notifyListeners();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async register(email: string, password: string, name: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user;
        this.notifyListeners();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.user = null;
      this.notifyListeners();
    }
  }

  getUser(): UserPayload | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }

  isLoading(): boolean {
    return this.loading;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }
}

export const authClient = new AuthClient();
