/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

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

  const acceptInviteSignup = async ({ email, password, name, creatorHandle, inviteToken, shippingAddress, dropId }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const cleanHandle = (creatorHandle || name || '').replace(/^@/, '').trim();
    const discountCode = `MOJI-${(cleanHandle || 'VIP').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
    const referralUrl = `https://renuiq.com?ref=mojipass&creator=${encodeURIComponent(cleanHandle)}`;

    const partnerDoc = {
      uid: userCredential.user.uid,
      email,
      name,
      creatorHandle: cleanHandle,
      inviteToken: inviteToken || null,
      dropId: dropId || null,
      discountCode,
      referralUrl,
      commissionRate: 0.15,
      discountRate: 0.15,
      brandPartner: 'RenuIQ Skin Science',
      brandDomain: 'renuiq.com',
      shippingAddress: shippingAddress || null,
      onboardingComplete: true,
      synergyScore: 100,
      tier: 'Tier 1 Creator',
      payoutMethod: 'Stripe/Direct',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'partners', userCredential.user.uid), partnerDoc);
    setPartnerData(partnerDoc);
    return { userCredential, partnerDoc };
  };

  const acceptInviteExisting = async ({ creatorHandle, inviteToken, shippingAddress, dropId }) => {
    if (!user) throw new Error("Not logged in");
    const cleanHandle = (creatorHandle || partnerData?.name || user.email.split('@')[0]).replace(/^@/, '').trim();
    const discountCode = `MOJI-${(cleanHandle || 'VIP').replace(/[^a-zA-Z0-9]/g, '').toUpperCase()}`;
    const referralUrl = `https://renuiq.com?ref=mojipass&creator=${encodeURIComponent(cleanHandle)}`;

    const updateData = {
      creatorHandle: cleanHandle,
      inviteToken: inviteToken || null,
      dropId: dropId || null,
      discountCode,
      referralUrl,
      commissionRate: 0.15,
      discountRate: 0.15,
      brandPartner: 'RenuIQ Skin Science',
      brandDomain: 'renuiq.com',
      onboardingComplete: true,
      updatedAt: new Date().toISOString()
    };
    if (shippingAddress) updateData.shippingAddress = shippingAddress;

    await updateDoc(doc(db, 'partners', user.uid), updateData);
    setPartnerData(prev => ({ ...(prev || {}), ...updateData }));
    return { ...partnerData, ...updateData };
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    partnerData,
    login,
    signup,
    acceptInviteSignup,
    acceptInviteExisting,
    logout,
    resetPassword,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
