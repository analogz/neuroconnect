import { useState, useEffect, useCallback } from "react";
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, isFirebaseConfigured } from "../config/firebase";

/**
 * useAuth — provides authentication state and methods.
 * When Firebase is configured, uses Google sign-in + Firestore profiles.
 * When not configured, falls back to local onboarding flow (demo mode).
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isFirebaseConfigured);

  // Listen for Firebase auth state
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch or create profile
        const profileRef = doc(db, "users", firebaseUser.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }
        // If no profile yet, user needs to complete onboarding
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isFirebaseConfigured) return;
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (isDemo) {
      setProfile(null);
      return;
    }
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  }, [isDemo]);

  const saveProfile = useCallback(
    async (profileData) => {
      if (isDemo) {
        // Demo mode — just set locally
        setProfile(profileData);
        return;
      }

      if (!user) return;
      const profileRef = doc(db, "users", user.uid);
      const fullProfile = {
        ...profileData,
        uid: user.uid,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date().toISOString(),
      };
      await setDoc(profileRef, fullProfile, { merge: true });
      setProfile(fullProfile);
    },
    [user, isDemo]
  );

  return {
    user,
    profile,
    loading,
    isDemo,
    isAuthenticated: isDemo ? Boolean(profile) : Boolean(user),
    needsOnboarding: isDemo ? !profile : Boolean(user) && !profile,
    signInWithGoogle,
    signOut,
    saveProfile,
  };
}
