import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useAnnouncements } from '../hooks/useAnnouncements';
import EventCard from '../components/events/EventCard';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import Loading from '../components/common/Loading';
import { FiCalendar, FiArrowRight, FiBell } from 'react-icons/fi';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { events, loading: eventsLoading } = useEvents(true);
  const { announcements, loading: announcementsLoading } = useAnnouncements(true);

  const upcomingEvents = events
    .filter((e) => new Date(e.startDate) > new Date())
    .slice(0, 3);

  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to EventHub
              {user && `, ${user.displayName}`}
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Discover, create, and manage amazing events. Connect with your community and make
              memories that last a lifetime.
            </p>
            {!user ? (
              <div className="flex gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/events"
                  className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <Link
                to="/dashboard"
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Event Management</h3>
            <p className="text-gray-600">
              Create and manage events with our intuitive interface. Add details, images, and track
              RSVPs effortlessly.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Stay informed with real-time announcements and updates about events you're interested
              in.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCalendar className="text-primary-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">RSVP System</h3>
            <p className="text-gray-600">
              Let attendees RSVP to your events and track attendance with our built-in RSVP system.
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
            <Link
              to="/events"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          {eventsLoading ? (
            <Loading />
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <FiCalendar className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-600">No upcoming events at the moment</p>
              {user && (
                <Link to="/dashboard" className="btn-primary mt-4 inline-block">
                  Create an Event
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent Announcements */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Announcements</h2>
            <Link
              to="/announcements"
              className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              View All <FiArrowRight />
            </Link>
          </div>

          {announcementsLoading ? (
            <Loading />
          ) : recentAnnouncements.length > 0 ? (
            <div className="space-y-4">
              {recentAnnouncements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <FiBell className="mx-auto text-5xl text-gray-300 mb-4" />
              <p className="text-gray-600">No announcements yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
