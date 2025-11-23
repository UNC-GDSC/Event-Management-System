import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toggleFavorite, getFavorites } from '../../services/favoriteService';
import { FiHeart } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface FavoriteButtonProps {
  eventId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ eventId }) => {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      if (!user) return;

      try {
        const favorites = await getFavorites(user.uid);
        setIsFavorite(favorites.includes(eventId));
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };

    checkFavorite();
  }, [user, eventId]);

  const handleToggle = async () => {
    if (!user) {
      toast.error('Please login to favorite events');
      return;
    }

    setLoading(true);
    try {
      await toggleFavorite(user.uid, eventId, isFavorite);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favorite');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-3 rounded-full transition-all ${
        isFavorite
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } disabled:opacity-50`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <FiHeart className={`text-xl ${isFavorite ? 'fill-current' : ''}`} />
    </button>
  );
};

export default FavoriteButton;
