import React from 'react';
import { Link } from 'react-router-dom';
import type { Event } from '../../types';
import { formatDate, getEventStatus } from '../../utils/dateUtils';
import { FiCalendar, FiMapPin, FiUsers, FiClock } from 'react-icons/fi';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const status = getEventStatus(event.startDate, event.endDate);

  const statusColors = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/events/${event.id}`} className="block">
      <div className="card-hover h-full flex flex-col">
        {event.imageUrl && (
          <div className="w-full h-48 overflow-hidden rounded-t-lg -mt-6 -mx-6 mb-4">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{event.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]} ml-2`}>
              {status}
            </span>
          </div>

          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{event.description}</p>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <FiCalendar className="mr-2 text-primary-600" />
              <span>{formatDate(event.startDate)}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <FiClock className="mr-2 text-primary-600" />
              <span>
                {new Date(event.startDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <FiMapPin className="mr-2 text-primary-600" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <FiUsers className="mr-2 text-primary-600" />
              <span>Capacity: {event.capacity}</span>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {event.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Created by <span className="font-medium text-gray-700">{event.createdByName}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
