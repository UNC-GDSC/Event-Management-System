import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserEvents } from '../hooks/useEvents';
import { createEvent } from '../services/eventService';
import type { EventFormData } from '../types';
import EventCard from '../components/events/EventCard';
import EventForm from '../components/events/EventForm';
import Loading from '../components/common/Loading';
import { FiPlus, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { events, loading } = useUserEvents(user?.uid || '');
  const [showEventForm, setShowEventForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateEvent = async (data: EventFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const eventId = await createEvent(data, user.uid, user.displayName);
      toast.success('Event created successfully!');
      setShowEventForm(false);
      navigate(`/events/${eventId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create event');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Manage your events and track your attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h3 className="text-sm font-medium text-primary-100 mb-1">Total Events</h3>
            <p className="text-3xl font-bold">{events.length}</p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <h3 className="text-sm font-medium text-green-100 mb-1">Upcoming Events</h3>
            <p className="text-3xl font-bold">
              {events.filter((e) => e.status === 'upcoming').length}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <h3 className="text-sm font-medium text-blue-100 mb-1">Completed Events</h3>
            <p className="text-3xl font-bold">
              {events.filter((e) => e.status === 'completed').length}
            </p>
          </div>
        </div>

        {/* Create Event Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> {showEventForm ? 'Cancel' : 'Create New Event'}
          </button>
        </div>

        {/* Event Form */}
        {showEventForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Event</h2>
            <EventForm
              onSubmit={handleCreateEvent}
              onCancel={() => setShowEventForm(false)}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* My Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Events</h2>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg">
              <FiCalendar className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6">Create your first event to get started</p>
              <button
                onClick={() => setShowEventForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <FiPlus /> Create Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
