import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { subscribeToComments, addComment, deleteComment, type Comment } from '../../services/commentService';
import { formatTimeAgo } from '../../utils/dateUtils';
import { FiMessageCircle, FiSend, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface CommentsProps {
  eventId: string;
}

const Comments: React.FC<CommentsProps> = ({ eventId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToComments(eventId, (comments) => {
      setComments(comments);
    });

    return () => unsubscribe();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);
    try {
      await addComment(eventId, user.uid, user.displayName, newComment.trim(), user.photoURL);
      setNewComment('');
      toast.success('Comment added!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await deleteComment(commentId);
      toast.success('Comment deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <FiMessageCircle className="text-2xl text-primary-600" />
        <h3 className="text-xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="input-field flex-1"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !newComment.trim()}
              className="btn-primary flex items-center gap-2"
            >
              <FiSend />
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {comment.userPhoto ? (
                  <img
                    src={comment.userPhoto}
                    alt={comment.userName}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{comment.userName}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</p>
                  </div>
                  {user && (user.uid === comment.userId || user.role === 'admin') && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default Comments;
