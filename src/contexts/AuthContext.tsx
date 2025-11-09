/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebaseConfig';
import { auth } from '../services/firebaseConfig';
import type { User } from '../types/Post';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

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
  const [error, setError] = useState<string | null>(null);

  // Enable a simple test-mode auth when running E2E locally or in CI with local project id
  const isTestAuth = import.meta.env.VITE_ENABLE_TEST_AUTH === 'true' || String(import.meta.env.VITE_FIREBASE_PROJECT_ID || '').startsWith('local');

  useEffect(() => {
    if (isTestAuth) {
      // In test mode, expose a fake admin user so E2E tests can run without real Firebase
      setUser({ id: 'test-user', email: 'test@example.com', name: 'Test User', role: 'admin' });
      setLoading(false);
      // expose a flag to the browser so tests can detect test-mode
      try {
        (window as { __TEST_AUTH__?: boolean }).__TEST_AUTH__ = true;
      } catch (e) {
        console.warn('Failed to set __TEST_AUTH__ flag:', String(e));
      }
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Fetch user metadata from Firestore (role, etc.) if available
        let role: 'admin' | 'user' = 'user';
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as { role?: string };
            if (data.role === 'admin') role = 'admin';
          }
        } catch (err) {
          console.warn('Failed to fetch user role from Firestore, defaulting to user', err);
        }

        // Convert Firebase user to our User type
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || undefined,
          role
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isTestAuth]);

  const login = async (email: string, password: string) => {
    if (isTestAuth) {
      // Accept any credentials in test mode
      setUser({ id: 'test-user', email, name: 'Test User', role: 'admin' });
      setLoading(false);
      return;
    }
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    if (isTestAuth) {
      setUser({ id: 'test-user', email, name, role: 'admin' });
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
  // Set the user's display name
  await updateProfile(firebaseUser, { displayName: name });
      // Create a Firestore user document with default role
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          email: firebaseUser.email,
          name,
          role: 'user'
        });
      } catch (err) {
        console.warn('Failed to create user document in Firestore', err);
      }

      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name,
        role: 'user'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
      throw err;
    }
  };

  const logout = async () => {
    if (isTestAuth) {
      setUser(null);
      return;
    }
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during logout');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
