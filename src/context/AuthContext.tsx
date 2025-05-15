import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';
import { getUserByEmail, createUser } from '../api/userApi';
import { toast } from 'react-toastify';

interface UserData {
  _id: string;
  email: string;
  firebaseUid: string;
  isAdmin: boolean;
  form: number;
  formData?: any;
  goldHoldings: {
    totalGold: number;
    goldInSafe: number;
    goldMortgaged: number;
  };
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUserData = async () => {
    if (currentUser?.email) {
      try {
        const data = await getUserByEmail(currentUser.email);
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user?.email) {
        try {
          // Try to get existing user data
          const data = await getUserByEmail(user.email);
          setUserData(data);
        } catch (error) {
          // If user doesn't exist, create new user
          try {
            const isAdmin = user.email === import.meta.env.VITE_ADMIN_EMAIL;
            const newUser = await createUser({
              email: user.email,
              firebaseUid: user.uid,
              isAdmin
            });
            setUserData(newUser);
          } catch (createError) {
            console.error('Error creating user:', createError);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      toast.error('Failed to sign in with Google');
      console.error('Sign in error:', error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUserData(null);
    } catch (error: any) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error.message);
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    signOut,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};