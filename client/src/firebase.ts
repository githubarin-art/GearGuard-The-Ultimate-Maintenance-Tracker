// Firebase initialization and auth helpers
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "gearguard-f3cf7.firebaseapp.com",
  projectId: "gearguard-f3cf7",
  storageBucket: "gearguard-f3cf7.firebasestorage.app",
  messagingSenderId: "143872893230",
  appId: "1:143872893230:web:3a12bfd5ec8e17ff1ddabf",
  measurementId: "G-DRCT8JRS0L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

const signOut = async () => {
  await firebaseSignOut(auth);
};

export { app, auth, googleProvider, signInWithGoogle, signOut, onAuthStateChanged };
export type { FirebaseUser };
