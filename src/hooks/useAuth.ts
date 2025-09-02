import { useAuth as useAuthContext } from '../contexts/AuthContext';

// Re-export the useAuth hook for convenience
export const useAuth = useAuthContext;

// Additional auth-related hooks can be added here
export function useRequireAuth() {
  const auth = useAuthContext();
  
  if (!auth.isAuthenticated && !auth.loading) {
    // You can redirect to login page here or throw an error
    throw new Error('Authentication required');
  }
  
  return auth;
}
