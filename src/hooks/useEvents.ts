import { useState, useEffect } from 'react';
import type { Event } from '../types';
import { getAllEvents, subscribeToEvents, getEventsByUser } from '../services/eventService';

export const useEvents = (realtime: boolean = false) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (realtime) {
      const unsubscribe = subscribeToEvents((events) => {
        setEvents(events);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      const fetchEvents = async () => {
        try {
          const fetchedEvents = await getAllEvents();
          setEvents(fetchedEvents);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchEvents();
    }
  }, [realtime]);

  return { events, loading, error };
};

export const useUserEvents = (userId: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEventsByUser(userId);
        setEvents(fetchedEvents);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEvents();
    }
  }, [userId]);

  return { events, loading, error };
};
