import React, { useState, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import EventCard from '../components/events/EventCard';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiSearch, FiFilter } from 'react-icons/fi';
import Fuse from 'fuse.js';

const Events: React.FC = () => {
  const { events, loading, error } = useEvents(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const categories = ['All', 'Conference', 'Workshop', 'Seminar', 'Meetup', 'Social', 'Sports', 'Arts', 'Education', 'Technology', 'Other'];
  const statuses = ['All', 'upcoming', 'ongoing', 'completed'];

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(events, {
      keys: ['title', 'description', 'location', 'category', 'tags', 'createdByName'],
      threshold: 0.3, // Lower threshold means stricter matching
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [events]);

  const filteredEvents = useMemo(() => {
    let results = events;

    // Apply fuzzy search if search term exists
    if (searchTerm.trim()) {
      const fuseResults = fuse.search(searchTerm);
      results = fuseResults.map((result) => result.item);
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'All') {
      results = results.filter((event) => event.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus && selectedStatus !== 'All') {
      results = results.filter((event) => event.status === selectedStatus);
    }

    return results;
  }, [events, searchTerm, selectedCategory, selectedStatus, fuse]);

  if (loading) {
    return <Loading fullScreen message="Loading events..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">All Events</h1>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Smart search events (title, description, location, tags, organizer)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field pl-10 pr-8"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat === 'All' ? '' : cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                {statuses.map((status) => (
                  <option key={status} value={status === 'All' ? '' : status}>
                    {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="mt-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No events found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedStatus('');
              }}
              className="btn-primary mt-4"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
