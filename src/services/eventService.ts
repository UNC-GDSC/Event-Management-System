import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import type { Event, EventFormData } from '../types';

export const createEvent = async (
  eventData: EventFormData,
  userId: string,
  userName: string
): Promise<string> => {
  try {
    let imageUrl = '';

    if (eventData.image) {
      const imageRef = ref(storage, `events/${Date.now()}_${eventData.image.name}`);
      await uploadBytes(imageRef, eventData.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const event = {
      title: eventData.title,
      description: eventData.description,
      startDate: Timestamp.fromDate(new Date(eventData.startDate)),
      endDate: Timestamp.fromDate(new Date(eventData.endDate)),
      location: eventData.location,
      imageUrl,
      category: eventData.category,
      capacity: eventData.capacity,
      createdBy: userId,
      createdByName: userName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: 'upcoming',
      tags: eventData.tags,
    };

    const docRef = await addDoc(collection(db, 'events'), event);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateEvent = async (
  eventId: string,
  eventData: Partial<EventFormData>,
  currentImageUrl?: string
): Promise<void> => {
  try {
    let imageUrl = currentImageUrl;

    if (eventData.image) {
      if (currentImageUrl) {
        try {
          const oldImageRef = ref(storage, currentImageUrl);
          await deleteObject(oldImageRef);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }

      const imageRef = ref(storage, `events/${Date.now()}_${eventData.image.name}`);
      await uploadBytes(imageRef, eventData.image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const updateData: any = {
      ...eventData,
      imageUrl,
      updatedAt: Timestamp.now(),
    };

    if (eventData.startDate) {
      updateData.startDate = Timestamp.fromDate(new Date(eventData.startDate));
    }
    if (eventData.endDate) {
      updateData.endDate = Timestamp.fromDate(new Date(eventData.endDate));
    }

    delete updateData.image;

    await updateDoc(doc(db, 'events', eventId), updateData);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteEvent = async (eventId: string, imageUrl?: string): Promise<void> => {
  try {
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    await deleteDoc(doc(db, 'events', eventId));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  try {
    const eventDoc = await getDoc(doc(db, 'events', eventId));
    if (eventDoc.exists()) {
      const data = eventDoc.data();
      return {
        id: eventDoc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Event;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const q = query(collection(db, 'events'), orderBy('startDate', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Event;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getEventsByUser = async (userId: string): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, 'events'),
      where('createdBy', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Event;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToEvents = (callback: (events: Event[]) => void) => {
  const q = query(collection(db, 'events'), orderBy('startDate', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    const events = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        endDate: data.endDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Event;
    });
    callback(events);
  });
};
