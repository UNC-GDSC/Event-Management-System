import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { RSVP } from '../types';

export const createOrUpdateRSVP = async (
  eventId: string,
  userId: string,
  userName: string,
  userEmail: string,
  status: 'going' | 'maybe' | 'not-going',
  numberOfGuests: number = 1
): Promise<void> => {
  try {
    const q = query(
      collection(db, 'rsvps'),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(collection(db, 'rsvps'), {
        eventId,
        userId,
        userName,
        userEmail,
        status,
        numberOfGuests,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
    } else {
      const rsvpDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, 'rsvps', rsvpDoc.id), {
        status,
        numberOfGuests,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteRSVP = async (rsvpId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'rsvps', rsvpId));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getRSVPsByEvent = async (eventId: string): Promise<RSVP[]> => {
  try {
    const q = query(collection(db, 'rsvps'), where('eventId', '==', eventId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as RSVP;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getRSVPByUserAndEvent = async (
  userId: string,
  eventId: string
): Promise<RSVP | null> => {
  try {
    const q = query(
      collection(db, 'rsvps'),
      where('eventId', '==', eventId),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as RSVP;
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getRSVPsByUser = async (userId: string): Promise<RSVP[]> => {
  try {
    const q = query(collection(db, 'rsvps'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as RSVP;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToEventRSVPs = (
  eventId: string,
  callback: (rsvps: RSVP[]) => void
) => {
  const q = query(collection(db, 'rsvps'), where('eventId', '==', eventId));

  return onSnapshot(q, (querySnapshot) => {
    const rsvps = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as RSVP;
    });
    callback(rsvps);
  });
};

export const getEventAttendeeCount = async (eventId: string): Promise<number> => {
  try {
    const q = query(
      collection(db, 'rsvps'),
      where('eventId', '==', eventId),
      where('status', '==', 'going')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.reduce((total, doc) => {
      return total + (doc.data().numberOfGuests || 1);
    }, 0);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
