import { useState, useEffect } from 'react';
import type { RSVP } from '../types';
import {
  getRSVPsByEvent,
  getRSVPByUserAndEvent,
  subscribeToEventRSVPs,
} from '../services/rsvpService';

export const useEventRSVPs = (eventId: string, realtime: boolean = false) => {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;

    if (realtime) {
      const unsubscribe = subscribeToEventRSVPs(eventId, (rsvps) => {
        setRsvps(rsvps);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      const fetchRSVPs = async () => {
        try {
          const fetchedRSVPs = await getRSVPsByEvent(eventId);
          setRsvps(fetchedRSVPs);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRSVPs();
    }
  }, [eventId, realtime]);

  return { rsvps, loading, error };
};

export const useUserRSVP = (userId: string, eventId: string) => {
  const [rsvp, setRsvp] = useState<RSVP | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSVP = async () => {
      try {
        const fetchedRSVP = await getRSVPByUserAndEvent(userId, eventId);
        setRsvp(fetchedRSVP);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && eventId) {
      fetchRSVP();
    }
  }, [userId, eventId]);

  const refresh = async () => {
    setLoading(true);
    try {
      const fetchedRSVP = await getRSVPByUserAndEvent(userId, eventId);
      setRsvp(fetchedRSVP);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { rsvp, loading, error, refresh };
};
