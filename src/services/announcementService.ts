import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Announcement, AnnouncementFormData } from '../types';

export const createAnnouncement = async (
  announcementData: AnnouncementFormData,
  userId: string,
  userName: string
): Promise<string> => {
  try {
    const announcement = {
      title: announcementData.title,
      content: announcementData.content,
      eventId: announcementData.eventId || null,
      priority: announcementData.priority,
      createdBy: userId,
      createdByName: userName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isPublished: true,
    };

    const docRef = await addDoc(collection(db, 'announcements'), announcement);
    return docRef.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateAnnouncement = async (
  announcementId: string,
  announcementData: Partial<AnnouncementFormData>
): Promise<void> => {
  try {
    const updateData = {
      ...announcementData,
      updatedAt: Timestamp.now(),
    };

    await updateDoc(doc(db, 'announcements', announcementId), updateData);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteAnnouncement = async (announcementId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'announcements', announcementId));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const q = query(
      collection(db, 'announcements'),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Announcement;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAnnouncementsByEvent = async (eventId: string): Promise<Announcement[]> => {
  try {
    const q = query(
      collection(db, 'announcements'),
      where('eventId', '==', eventId),
      where('isPublished', '==', true),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Announcement;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToAnnouncements = (callback: (announcements: Announcement[]) => void) => {
  const q = query(
    collection(db, 'announcements'),
    where('isPublished', '==', true),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const announcements = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Announcement;
    });
    callback(announcements);
  });
};
