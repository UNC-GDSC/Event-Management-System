import React from 'react';
import { useEventRSVPs } from '../../hooks/useRSVPs';
import { FiUsers, FiMail } from 'react-icons/fi';
import Loading from '../common/Loading';

interface AttendeesListProps {
  eventId: string;
}

const AttendeesList: React.FC<AttendeesListProps> = ({ eventId }) => {
  const { rsvps, loading } = useEventRSVPs(eventId, true);

  const attendees = rsvps.filter((rsvp) => rsvp.status === 'going');

  if (loading) {
    return <Loading message="Loading attendees..." />;
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <FiUsers className="text-2xl text-primary-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Attendees ({attendees.length})
        </h3>
      </div>

      {attendees.length > 0 ? (
        <div className="space-y-3">
          {attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {attendee.userName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{attendee.userName}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FiMail className="text-xs" />
                    {attendee.userEmail}
                  </div>
                </div>
              </div>
              {attendee.numberOfGuests > 1 && (
                <span className="text-sm text-gray-600">
                  +{attendee.numberOfGuests - 1} guest{attendee.numberOfGuests > 2 ? 's' : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-8">No attendees yet</p>
      )}
    </div>
  );
};

export default AttendeesList;
