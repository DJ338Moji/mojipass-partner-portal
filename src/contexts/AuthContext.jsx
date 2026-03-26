import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      setUser(userAuth);
      
      if (userAuth) {
        try {
          // Fetch additional partner data from Firestore
          const docRef = doc(db, 'partners', userAuth.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setPartnerData(docSnap.data());
          } else {
            setPartnerData(null);
          }
        } catch (error) {
          console.error("Error fetching partner profile:", error);
        }
      } else {
        setPartnerData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Initialize empty partner profile
    await setDoc(doc(db, 'partners', userCredential.user.uid), {
      email,
      name,
      createdAt: new Date().toISOString(),
      onboardingComplete: false
    });
    return userCredential;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    partnerData,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
