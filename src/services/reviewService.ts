import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Review } from '../types';

export const addReview = async (
  eventId: string,
  userId: string,
  userName: string,
  rating: number,
  comment: string,
  userPhoto?: string
): Promise<void> => {
  // Check if user already reviewed this event
  const existingQuery = query(
    collection(db, 'reviews'),
    where('eventId', '==', eventId),
    where('userId', '==', userId)
  );
  const existingReviews = await getDocs(existingQuery);

  if (!existingReviews.empty) {
    throw new Error('You have already reviewed this event');
  }

  await addDoc(collection(db, 'reviews'), {
    eventId,
    userId,
    userName,
    userPhoto,
    rating,
    comment,
    createdAt: Timestamp.now(),
  });
};

export const subscribeToReviews = (
  eventId: string,
  callback: (reviews: Review[]) => void
) => {
  const q = query(
    collection(db, 'reviews'),
    where('eventId', '==', eventId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const reviews = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      } as Review;
    });
    callback(reviews);
  });
};

export const deleteReview = async (reviewId: string): Promise<void> => {
  await deleteDoc(doc(db, 'reviews', reviewId));
};

export const getEventAverageRating = async (eventId: string): Promise<{ average: number; count: number }> => {
  const q = query(collection(db, 'reviews'), where('eventId', '==', eventId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { average: 0, count: 0 };
  }

  const ratings = snapshot.docs.map((doc) => doc.data().rating);
  const average = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;

  return { average, count: ratings.length };
};
