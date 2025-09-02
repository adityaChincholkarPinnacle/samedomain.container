'use client';
import { useState, useEffect } from 'react';
import { authClient } from '../lib/authClient';
import { UserPayload } from '../lib/jwt';

export function useAuthClient() {
  // Initialize with null/true for SSR compatibility
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set initial values from authClient
    setUser(authClient.getUser());
    setLoading(authClient.isLoading());

    const unsubscribe = authClient.subscribe(() => {
      setUser(authClient.getUser());
      setLoading(authClient.isLoading());
    });

    return unsubscribe;
  }, []);

  // Return loading state until component is mounted
  if (!mounted) {
    return {
      user: null,
      loading: true,
      isAuthenticated: false,
      login: authClient.login.bind(authClient),
      register: authClient.register.bind(authClient),
      logout: authClient.logout.bind(authClient),
    };
  }

  return {
    user,
    loading,
    isAuthenticated: authClient.isAuthenticated(),
    login: authClient.login.bind(authClient),
    register: authClient.register.bind(authClient),
    logout: authClient.logout.bind(authClient),
  };
}
