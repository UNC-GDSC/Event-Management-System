import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import type { User } from '../types';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout,
  getCurrentUser,
} from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await getCurrentUser(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string, displayName: string) => {
    const newUser = await registerWithEmail(email, password, displayName);
    setUser(newUser);
  };

  const login = async (email: string, password: string) => {
    const userData = await loginWithEmail(email, password);
    setUser(userData);
  };

  const handleGoogleLogin = async () => {
    const userData = await loginWithGoogle();
    setUser(userData);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    register,
    login,
    loginWithGoogle: handleGoogleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
