import React from 'react';
import type { Announcement } from '../../types';
import { formatTimeAgo } from '../../utils/dateUtils';
import { FiBell, FiAlertCircle } from 'react-icons/fi';

interface AnnouncementCardProps {
  announcement: Announcement;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityIcons = {
    low: FiBell,
    medium: FiBell,
    high: FiAlertCircle,
  };

  const Icon = priorityIcons[announcement.priority];

  return (
    <div className={`card border-l-4 ${priorityColors[announcement.priority]}`}>
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            announcement.priority === 'high'
              ? 'bg-red-200'
              : announcement.priority === 'medium'
              ? 'bg-yellow-200'
              : 'bg-blue-200'
          }`}
        >
          <Icon
            className={`text-xl ${
              announcement.priority === 'high'
                ? 'text-red-700'
                : announcement.priority === 'medium'
                ? 'text-yellow-700'
                : 'text-blue-700'
            }`}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900">{announcement.title}</h3>
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                announcement.priority === 'high'
                  ? 'bg-red-100 text-red-700'
                  : announcement.priority === 'medium'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {announcement.priority}
            </span>
          </div>

          <p className="text-gray-700 mb-3 whitespace-pre-wrap">{announcement.content}</p>

          <div className="text-xs text-gray-500">
            <span>By {announcement.createdByName}</span>
            <span className="mx-2">•</span>
            <span>{formatTimeAgo(announcement.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
