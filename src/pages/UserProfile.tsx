import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { useRSVPs } from '../hooks/useRSVPs';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { db, storage, auth } from '../config/firebase';
import { FiUser, FiMail, FiCalendar, FiCheckCircle, FiCamera, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import EventCard from '../components/events/EventCard';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { events } = useEvents();
  const { rsvps } = useRSVPs(user?.uid);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const myEvents = events.filter((e) => e.createdBy === user?.uid);
  const myRSVPs = rsvps.filter((r) => r.userId === user?.uid);
  const attendingEvents = events.filter((e) =>
    myRSVPs.some((r) => r.eventId === e.id && r.status === 'going')
  );

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user || !auth.currentUser) return;

    setLoading(true);
    try {
      let photoURL = user.photoURL;

      // Upload new photo if selected
      if (photoFile) {
        const photoRef = ref(storage, `profile-photos/${user.uid}`);
        await uploadBytes(photoRef, photoFile);
        photoURL = await getDownloadURL(photoRef);
      }

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: photoURL || undefined,
      });

      // Update Firestore user document
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName,
        bio,
        photoURL,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      window.location.reload(); // Refresh to update user context
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setDisplayName(user.displayName || '');
      setBio(user.bio || '');
    }
    setPhotoFile(null);
    setPhotoPreview(null);
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Please log in</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="card bg-white dark:bg-gray-800 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                {photoPreview || user.photoURL ? (
                  <img
                    src={photoPreview || user.photoURL}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiUser className="text-6xl text-gray-400" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                  <FiCamera className="text-xl" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="input w-full"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="input w-full"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {user.displayName}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 dark:text-gray-400 mb-2">
                    <FiMail className="text-lg" />
                    <span>{user.email}</span>
                  </div>
                  {user.bio && (
                    <p className="text-gray-600 dark:text-gray-400 mt-2">{user.bio}</p>
                  )}
                  {user.role === 'admin' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                      Admin
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Edit Buttons */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <FiSave />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="btn bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-2"
                  >
                    <FiX />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary flex items-center gap-2"
                >
                  <FiEdit2 />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Events Created</p>
                <p className="text-3xl font-bold mt-1">{myEvents.length}</p>
              </div>
              <FiCalendar className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Events Attending</p>
                <p className="text-3xl font-bold mt-1">{attendingEvents.length}</p>
              </div>
              <FiCheckCircle className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total RSVPs</p>
                <p className="text-3xl font-bold mt-1">{myRSVPs.length}</p>
              </div>
              <FiCheckCircle className="text-4xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Events Tabs */}
        <div className="card bg-white dark:bg-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              My Events
            </h2>
            {myEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                You haven't created any events yet.
              </p>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Attending Events
            </h2>
            {attendingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attendingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                You're not attending any events yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
