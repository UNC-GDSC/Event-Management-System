import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEvent, updateEvent } from '../services/eventService';
import type { Event, EventFormData } from '../types';
import EventForm from '../components/events/EventForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';

const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const eventData = await getEvent(id);
        if (eventData) {
          if (eventData.createdBy !== user?.uid && user?.role !== 'admin') {
            setError('You do not have permission to edit this event');
          } else {
            setEvent(eventData);
          }
        } else {
          setError('Event not found');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, user]);

  const handleUpdateEvent = async (data: EventFormData) => {
    if (!event) return;

    setIsSubmitting(true);
    try {
      await updateEvent(event.id, data, event.imageUrl);
      toast.success('Event updated successfully!');
      navigate(`/events/${event.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update event');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading event..." />;
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message={error || 'Event not found'} />
        <button onClick={() => navigate('/dashboard')} className="btn-primary mt-4">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(`/events/${event.id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft /> Back to Event
        </button>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Event</h1>
          <EventForm
            event={event}
            onSubmit={handleUpdateEvent}
            onCancel={() => navigate(`/events/${event.id}`)}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
