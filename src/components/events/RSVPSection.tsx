import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserRSVP, useEventRSVPs } from '../../hooks/useRSVPs';
import { createOrUpdateRSVP } from '../../services/rsvpService';
import { toast } from 'react-toastify';
import { FiCheck, FiHelpCircle, FiX, FiUsers } from 'react-icons/fi';

interface RSVPSectionProps {
  eventId: string;
}

const RSVPSection: React.FC<RSVPSectionProps> = ({ eventId }) => {
  const { user } = useAuth();
  const { rsvp, refresh } = useUserRSVP(user?.uid || '', eventId);
  const { rsvps } = useEventRSVPs(eventId, true);
  const [loading, setLoading] = useState(false);

  const handleRSVP = async (status: 'going' | 'maybe' | 'not-going') => {
    if (!user) {
      toast.error('Please login to RSVP');
      return;
    }

    setLoading(true);
    try {
      await createOrUpdateRSVP(eventId, user.uid, user.displayName, user.email, status, 1);
      await refresh();
      toast.success(`RSVP updated to "${status}"!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update RSVP');
    } finally {
      setLoading(false);
    }
  };

  const goingCount = rsvps.filter((r) => r.status === 'going').length;
  const maybeCount = rsvps.filter((r) => r.status === 'maybe').length;

  const buttons = [
    {
      status: 'going' as const,
      label: 'Going',
      icon: FiCheck,
      color: 'bg-green-600 hover:bg-green-700 text-white',
      outlineColor: 'border-green-600 text-green-600 hover:bg-green-50',
    },
    {
      status: 'maybe' as const,
      label: 'Maybe',
      icon: FiHelpCircle,
      color: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      outlineColor: 'border-yellow-600 text-yellow-600 hover:bg-yellow-50',
    },
    {
      status: 'not-going' as const,
      label: 'Not Going',
      icon: FiX,
      color: 'bg-red-600 hover:bg-red-700 text-white',
      outlineColor: 'border-red-600 text-red-600 hover:bg-red-50',
    },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-4">RSVP</h3>

      <div className="flex flex-wrap gap-3 mb-6">
        {buttons.map((button) => {
          const isActive = rsvp?.status === button.status;
          const Icon = button.icon;

          return (
            <button
              key={button.status}
              onClick={() => handleRSVP(button.status)}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
                isActive ? button.color : button.outlineColor + ' bg-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Icon className="text-lg" />
              {button.label}
            </button>
          );
        })}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <FiUsers className="text-green-600" />
            <span>
              <strong className="text-gray-900">{goingCount}</strong> Going
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FiHelpCircle className="text-yellow-600" />
            <span>
              <strong className="text-gray-900">{maybeCount}</strong> Maybe
            </span>
          </div>
        </div>
      </div>

      {rsvp && (
        <div className="mt-4 p-3 bg-primary-50 rounded-lg">
          <p className="text-sm text-primary-800">
            You responded: <strong className="capitalize">{rsvp.status}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

export default RSVPSection;
