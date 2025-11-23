export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  imageUrl?: string;
  category: string;
  capacity: number;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
}

export interface RSVP {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'going' | 'maybe' | 'not-going';
  createdAt: Date;
  updatedAt: Date;
  numberOfGuests: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  eventId?: string;
  createdBy: string;
  createdByName: string;
  createdAt: Date;
  updatedAt: Date;
  priority: 'low' | 'medium' | 'high';
  isPublished: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  capacity: number;
  tags: string[];
  image?: File;
}

export interface AnnouncementFormData {
  title: string;
  content: string;
  eventId?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface UserProfile extends User {
  eventsAttending: string[];
  eventsCreated: string[];
}

export type EventFilter = {
  category?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
};

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'rsvp' | 'comment' | 'review' | 'announcement' | 'reminder';
  title: string;
  message: string;
  eventId?: string;
  isRead: boolean;
  createdAt: Date;
}
