import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
  onSnapshot,
  deleteDoc,
  doc,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  content: string;
  createdAt: Date;
}

export const addComment = async (
  eventId: string,
  userId: string,
  userName: string,
  content: string,
  userPhoto?: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'comments'), {
      eventId,
      userId,
      userName,
      userPhoto,
      content,
      createdAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteComment = async (commentId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getCommentsByEvent = async (eventId: string): Promise<Comment[]> => {
  try {
    const q = query(
      collection(db, 'comments'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Comment;
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const subscribeToComments = (
  eventId: string,
  callback: (comments: Comment[]) => void
) => {
  const q = query(
    collection(db, 'comments'),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const comments = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Comment;
    });
    callback(comments);
  });
};
