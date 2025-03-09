import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

type AuthProviderProps = {
  children: ReactNode;
};

// Sample accounts
const SAMPLE_ACCOUNTS = {
  'student@123.com': {
    password: '123123',
    firstName: 'Sample',
    lastName: 'Student',
    role: 'student' as const,
  },
  'teacher@123.com': {
    password: '123123',
    firstName: 'Sample',
    lastName: 'Teacher',
    role: 'teacher' as const,
  },
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email && SAMPLE_ACCOUNTS[firebaseUser.email]) {
        const sampleUser = SAMPLE_ACCOUNTS[firebaseUser.email];
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          firstName: sampleUser.firstName,
          lastName: sampleUser.lastName,
          role: sampleUser.role,
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string, role: string) => {
    const sampleUser = SAMPLE_ACCOUNTS[email];
    
    if (!sampleUser || sampleUser.password !== password || sampleUser.role !== role) {
      throw new Error('Invalid credentials or role');
    }

    try {
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      setUser({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        firstName: sampleUser.firstName,
        lastName: sampleUser.lastName,
        role: sampleUser.role,
      });
    } catch (error) {
      // If the user doesn't exist in Firebase, create it
      if ((error as any).code === 'auth/user-not-found') {
        const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          firstName: sampleUser.firstName,
          lastName: sampleUser.lastName,
          role: sampleUser.role,
        });
      } else {
        throw error;
      }
    }
  };

  const register = async (userData: any) => {
    const { email, password, firstName, lastName, role } = userData;
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    
    setUser({
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      firstName,
      lastName,
      role: role || 'student',
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}