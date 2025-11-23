import React, { useMemo, useState } from 'react';
import { Calendar, momentLocalizer, type View } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import type { Event } from '../types';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendar.css';
import Loading from '../components/common/Loading';

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Event;
}

const CalendarView: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(events.map((e) => e.category));
    return ['all', ...Array.from(cats)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return selectedCategory === 'all'
      ? events
      : events.filter((e) => e.category === selectedCategory);
  }, [events, selectedCategory]);

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    return filteredEvents.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate,
      resource: event,
    }));
  }, [filteredEvents]);

  const handleSelectEvent = (event: CalendarEvent) => {
    navigate(`/events/${event.id}`);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const statusColors: Record<string, string> = {
      upcoming: '#3b82f6',
      ongoing: '#10b981',
      completed: '#6b7280',
      cancelled: '#ef4444',
    };

    return {
      style: {
        backgroundColor: statusColors[event.resource.status] || '#3b82f6',
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  if (loading) {
    return <Loading fullScreen message="Loading calendar..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Event Calendar
          </h1>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Upcoming</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Ongoing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-600"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Cancelled</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="card bg-white dark:bg-gray-800 p-4" style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            popup
            className="dark:text-white"
            style={{ height: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
