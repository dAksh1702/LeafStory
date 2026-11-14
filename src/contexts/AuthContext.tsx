/**
 * Prototype Authentication Context.
 *
 * Backed by LocalAuthRepository for prototype accounts with password verification,
 * session management, per-user data isolation, and onboarding state.
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthRepository, PrototypeAccount, AuthResult } from '../services/authRepository';

interface AuthContextType {
  user: PrototypeAccount | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<PrototypeAccount>) => Promise<boolean>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PrototypeAccount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize session on mount
  useEffect(() => {
    let mounted = true;

    AuthRepository.getSession()
      .then((account) => {
        if (mounted) {
          setUser(account);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn('[AuthContext] Error restoring session:', err);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  // SIGN IN
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    const result = await AuthRepository.signIn(email, password);
    if (result.success && result.account) {
      setUser(result.account);
    }
    return result;
  };

  // SIGN UP
  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<AuthResult> => {
    const result = await AuthRepository.signUp(displayName, email, password);
    if (result.success && result.account) {
      setUser(result.account);
    }
    return result;
  };

  // SIGN OUT
  const signOut = async (): Promise<void> => {
    await AuthRepository.signOut();
    setUser(null);
  };

  // UPDATE PROFILE
  const updateProfile = async (updates: Partial<PrototypeAccount>): Promise<boolean> => {
    if (!user) return false;
    const updated = await AuthRepository.updateAccount(user.id, updates);
    if (updated) {
      setUser(updated);
      return true;
    }
    return false;
  };

  // COMPLETE ONBOARDING
  const completeOnboarding = async (): Promise<void> => {
    if (!user) return;
    await AuthRepository.completeOnboarding(user.id);
    setUser((prev) => (prev ? { ...prev, onboardingCompleted: true } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
