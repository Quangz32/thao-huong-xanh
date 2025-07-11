import { useState, useEffect } from 'react';
import { AuthUser, onAuthStateChange, signIn, signOutUser } from '@/services/AuthService';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const user = await signIn(email, password);
      setUser(user);
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOutUser();
      setUser(null);
      return { success: true };
    } catch (error: any) {
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
} 