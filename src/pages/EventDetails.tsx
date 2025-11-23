import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getEvent, deleteEvent } from '../services/eventService';
import type { Event } from '../types';
import { formatDate, formatDateTime, getEventStatus } from '../utils/dateUtils';
import RSVPSection from '../components/events/RSVPSection';
import Comments from '../components/events/Comments';
import AttendeesList from '../components/events/AttendeesList';
import FavoriteButton from '../components/events/FavoriteButton';
import ShareEvent from '../components/events/ShareEvent';
import QRCodeModal from '../components/events/QRCodeModal';
import ExportAttendees from '../components/events/ExportAttendees';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiEdit, FiTrash2, FiArrowLeft, FiShare2, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const eventData = await getEvent(id);
        if (eventData) {
          setEvent(eventData);
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
  }, [id]);

  const handleDelete = async () => {
    if (!event || !window.confirm('Are you sure you want to delete this event?')) return;

    setDeleting(true);
    try {
      await deleteEvent(event.id, event.imageUrl);
      toast.success('Event deleted successfully');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete event');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading event details..." />;
  }

  if (error || !event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message={error || 'Event not found'} />
        <button onClick={() => navigate('/events')} className="btn-primary mt-4">
          Back to Events
        </button>
      </div>
    );
  }

  const status = getEventStatus(event.startDate, event.endDate);
  const isCreator = user?.uid === event.createdBy;

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
        >
          <FiArrowLeft /> Back to Events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-96 object-cover rounded-lg -mt-6 -mx-6 mb-6"
                />
              )}

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{event.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                    {status}
                  </span>
                </div>

                <div className="flex gap-2 ml-4">
                  <FavoriteButton eventId={event.id} />
                  <button
                    onClick={() => setShowShare(true)}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                    title="Share event"
                  >
                    <FiShare2 className="text-xl text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={() => setShowQR(true)}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                    title="Show QR Code"
                  >
                    <FiDownload className="text-xl text-gray-700 dark:text-gray-300" />
                  </button>
                </div>
              </div>

              {isCreator && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => navigate(`/events/${event.id}/edit`)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-danger flex items-center gap-2"
                  >
                    <FiTrash2 /> {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <ExportAttendees eventId={event.id} eventTitle={event.title} />
                </div>
              )}

              <div className="prose max-w-none mb-6 dark:text-gray-300">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiCalendar className="text-primary-600 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(event.startDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiClock className="text-primary-600 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(event.endDate)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiMapPin className="text-primary-600 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-900 dark:text-white">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <FiUsers className="text-primary-600 text-xl mt-1" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Capacity</p>
                    <p className="font-medium text-gray-900 dark:text-white">{event.capacity} people</p>
                  </div>
                </div>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Created by <span className="font-medium text-gray-900 dark:text-white">{event.createdByName}</span> on{' '}
                  {formatDate(event.createdAt)}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <Comments eventId={event.id} />

            {/* Attendees List */}
            <AttendeesList eventId={event.id} />
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {user && <RSVPSection eventId={event.id} />}

              <div className="card dark:bg-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Event Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Category</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{event.category}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Status</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white capitalize">{status}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Created</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(event.createdAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600 dark:text-gray-400">Last Updated</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">{formatDate(event.updatedAt)}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {event && (
        <>
          <ShareEvent event={event} isOpen={showShare} onClose={() => setShowShare(false)} />
          <QRCodeModal event={event} isOpen={showQR} onClose={() => setShowQR(false)} />
        </>
      )}
    </div>
  );
};

export default EventDetails;
