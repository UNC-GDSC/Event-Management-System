import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const toggleFavorite = async (
  userId: string,
  eventId: string,
  isFavorite: boolean
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);

    if (isFavorite) {
      await updateDoc(userRef, {
        favorites: arrayRemove(eventId),
      });
    } else {
      await updateDoc(userRef, {
        favorites: arrayUnion(eventId),
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getFavorites = async (userId: string): Promise<string[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().favorites || [];
    }
    return [];
  } catch (error: any) {
    throw new Error(error.message);
  }
};
