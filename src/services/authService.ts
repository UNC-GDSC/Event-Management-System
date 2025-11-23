import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { User } from '../types';

const googleProvider = new GoogleAuthProvider();

export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    await updateProfile(user, { displayName });

    const newUser: User = {
      uid: user.uid,
      email: user.email!,
      displayName,
      photoURL: user.photoURL || undefined,
      role: 'user',
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), newUser);

    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }

    throw new Error('User data not found');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;

    const userDoc = await getDoc(doc(db, 'users', user.uid));

    if (userDoc.exists()) {
      return userDoc.data() as User;
    }

    const newUser: User = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || undefined,
      role: 'user',
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), newUser);

    return newUser;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
