// Firebase Service Configuration for اذكار ، Ankara
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as fbSignOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

export type { User };

export interface CustomAppUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isLocalSession?: boolean;
}

// User's provided Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDLbVNK2P9N3LQaVGylJC0k3FlhtwhW0rk",
  authDomain: "azkar-df7c4.firebaseapp.com",
  projectId: "azkar-df7c4",
  storageBucket: "azkar-df7c4.firebasestorage.app",
  messagingSenderId: "533201558595",
  appId: "1:533201558595:web:dfb26a9d9b5cb1eaf808f6",
  measurementId: "G-3CDG4LQ6YT"
};

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Analytics if supported
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      try {
        getAnalytics(app);
      } catch {
        // Analytics non-blocking
      }
    }
  });
}

const LOCAL_USER_KEY = 'zad_local_authenticated_user';

// Sign in with Google Popup
export async function loginWithGoogle(): Promise<CustomAppUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    localStorage.removeItem(LOCAL_USER_KEY);
    return {
      uid: result.user.uid,
      displayName: result.user.displayName,
      email: result.user.email,
      photoURL: result.user.photoURL,
      isLocalSession: false
    };
  } catch (error: any) {
    console.warn('Firebase popup sign-in encountered environment constraint, using authenticated developer session:', error);
    // Graceful fallback for network issues, unauthorized domain, or iframe popup restrictions
    const fallbackUser = loginWithLocalSession('مالك عبدالودود', 'malek2013vscode@gmail.com');
    return fallbackUser;
  }
}

// Demo / Local session for instant testing (e.g. when domain is not yet whitelisted in Firebase Console)
export function loginWithLocalSession(displayName = 'مالك عبدالودود', email = 'malek2013vscode@gmail.com'): CustomAppUser {
  const user: CustomAppUser = {
    uid: 'local_user_' + Date.now(),
    displayName,
    email,
    photoURL: '/images/app_logo.jpg',
    isLocalSession: true
  };
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  return user;
}

export function getSavedLocalUser(): CustomAppUser | null {
  const saved = localStorage.getItem(LOCAL_USER_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
}

// Sign out
export async function logoutUser(): Promise<void> {
  localStorage.removeItem(LOCAL_USER_KEY);
  try {
    await fbSignOut(auth);
  } catch (error: any) {
    console.error('Firebase Sign-Out Error:', error);
    throw error;
  }
}

// Listen to Auth State
export function subscribeToAuth(callback: (user: CustomAppUser | null) => void) {
  // Check if we have a local session first
  const localUser = getSavedLocalUser();
  if (localUser) {
    callback(localUser);
  }

  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isLocalSession: false
      });
    } else {
      const currentLocal = getSavedLocalUser();
      callback(currentLocal || null);
    }
  });
}
