"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User as FirebaseUser, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<any>;
  signupWithEmail: (email: string, pass: string) => Promise<any>;
  loginWithGoogle: () => Promise<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const formattedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setUser(formattedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const handleAuthSuccess = () => {
    router.push('/dashboard');
  };

  const handleAuthError = (error: any) => {
    toast({
      variant: "destructive",
      title: "Authentication failed",
      description: error.message || "An unknown error occurred.",
    });
  }

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };
  
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const value = {
    user,
    loading,
    loginWithEmail,
    signupWithEmail,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
