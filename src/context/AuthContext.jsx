import { createContext, useState, useContext, useEffect } from 'react';
import { auth, db as firestoreDB } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

const ADMIN_EMAILS = ['nabstertsr@gmail.com'];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);

        try {
          const profileRef = doc(firestoreDB, 'users', currentUser.uid);
          const profileSnap = await getDoc(profileRef);

          if (profileSnap.exists()) {
            const data = profileSnap.data();
            setUserProfile(data);
            localStorage.setItem('tp_user_profile', JSON.stringify(data));
          } else {
            const defaultProfile = {
              uid: currentUser.uid,
              email: currentUser.email,
              name: currentUser.displayName || 'New User',
              role: 'Learner', // Default to Learner
              createdAt: new Date().toISOString(),
              isAdmin: ADMIN_EMAILS.includes(currentUser.email?.toLowerCase())
            };
            await setDoc(profileRef, defaultProfile);
            setUserProfile(defaultProfile);
            localStorage.setItem('tp_user_profile', JSON.stringify(defaultProfile));
          }
        } catch (e) {
          console.error("Profile sync error:", e);
          // Fallback to local if offline
          const cached = localStorage.getItem('tp_user_profile');
          if (cached) setUserProfile(JSON.parse(cached));
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setUserProfile(null);
      }
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      userProfile,
      logout,
      isAdmin: userProfile?.isAdmin || false,
      isTeacher: userProfile?.role === 'Teacher' || userProfile?.isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
