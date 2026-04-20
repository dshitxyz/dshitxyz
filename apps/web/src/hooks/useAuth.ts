'use client';

import { useEffect, useState } from 'react';

interface AuthUser {
  id: string;
  address: string;
  pseudonym: string;
  avatar: string;
  createdAt: string;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      // Optionally verify token is still valid by calling /api/users/me
      verifyToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const verifyToken = async (tokenToVerify: string) => {
    try {
      const response = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user || userData);
      } else {
        // Token is invalid, clear it
        localStorage.removeItem('auth_token');
        setToken(null);
        setError('Token expired or invalid');
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      setError('Failed to verify token');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  return {
    token,
    user,
    isLoading,
    error,
    logout,
    isAuthenticated: !!token,
  };
}
