import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { createAnnouncement } from '../services/announcementService';
import AnnouncementCard from '../components/announcements/AnnouncementCard';
import AnnouncementForm from '../components/announcements/AnnouncementForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { FiPlus, FiBell } from 'react-icons/fi';
import { toast } from 'react-toastify';
import type { AnnouncementFormData } from '../types';

const Announcements: React.FC = () => {
  const { user } = useAuth();
  const { announcements, loading, error } = useAnnouncements(true);
  const [showForm, setShowForm] = useState(false);

  const handleCreateAnnouncement = async (data: AnnouncementFormData) => {
    if (!user) return;

    try {
      await createAnnouncement(data, user.uid, user.displayName);
      toast.success('Announcement created successfully!');
      setShowForm(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create announcement');
      throw error;
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading announcements..." />;
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
              <p className="text-gray-600">Stay updated with the latest news and updates</p>
            </div>
            {user && (
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary flex items-center gap-2"
              >
                <FiPlus /> {showForm ? 'Cancel' : 'New Announcement'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Announcement</h2>
            <AnnouncementForm
              onSubmit={handleCreateAnnouncement}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <FiBell className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No announcements yet</h3>
            <p className="text-gray-600 mb-6">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
