import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { addReview, subscribeToReviews, deleteReview } from '../../services/reviewService';
import type { Review, Event } from '../../types';
import { FiStar, FiTrash2, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ReactStars from 'react-rating-stars-component';
import { format } from 'date-fns';

interface ReviewsProps {
  event: Event;
  canReview: boolean; // User attended and event is completed
}

const Reviews: React.FC<ReviewsProps> = ({ event, canReview }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToReviews(event.id, setReviews);
    return unsubscribe;
  }, [event.id]);

  const userHasReviewed = reviews.some((r) => r.userId === user?.uid);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    setLoading(true);
    try {
      await addReview(
        event.id,
        user.uid,
        user.displayName,
        rating,
        comment.trim(),
        user.photoURL
      );
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      setShowForm(false);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId);
      toast.success('Review deleted successfully');
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Reviews & Ratings
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FiStar className="text-yellow-500 fill-current" />
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <span className="text-gray-600 dark:text-gray-400">
                ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>

        {canReview && !userHasReviewed && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && canReview && !userHasReviewed && (
        <form onSubmit={handleSubmit} className="card bg-gray-50 dark:bg-gray-800 mb-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Write Your Review
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rating
            </label>
            <ReactStars
              count={5}
              onChange={setRating}
              size={40}
              activeColor="#fbbf24"
              value={rating}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="input w-full"
              rows={4}
              placeholder="Share your experience..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="card bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    {review.userPhoto ? (
                      <img
                        src={review.userPhoto}
                        alt={review.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="text-gray-400 text-xl" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {format(review.createdAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {user?.uid === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`${
                      i < review.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            No reviews yet. Be the first to review this event!
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
