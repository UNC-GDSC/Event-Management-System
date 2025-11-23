import { useState, useEffect } from 'react';
import type { Announcement } from '../types';
import {
  getAllAnnouncements,
  getAnnouncementsByEvent,
  subscribeToAnnouncements,
} from '../services/announcementService';

export const useAnnouncements = (realtime: boolean = false) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (realtime) {
      const unsubscribe = subscribeToAnnouncements((announcements) => {
        setAnnouncements(announcements);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      const fetchAnnouncements = async () => {
        try {
          const fetchedAnnouncements = await getAllAnnouncements();
          setAnnouncements(fetchedAnnouncements);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchAnnouncements();
    }
  }, [realtime]);

  return { announcements, loading, error };
};

export const useEventAnnouncements = (eventId: string) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const fetchedAnnouncements = await getAnnouncementsByEvent(eventId);
        setAnnouncements(fetchedAnnouncements);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchAnnouncements();
    }
  }, [eventId]);

  return { announcements, loading, error };
};
