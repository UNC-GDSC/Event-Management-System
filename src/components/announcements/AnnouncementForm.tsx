import React, { useState } from 'react';
import type { AnnouncementFormData } from '../../types';
import { validateAnnouncementForm } from '../../utils/validation';
import { toast } from 'react-toastify';

interface AnnouncementFormProps {
  onSubmit: (data: AnnouncementFormData) => Promise<void>;
  onCancel: () => void;
  eventId?: string;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSubmit, onCancel, eventId }) => {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    priority: 'medium',
    eventId,
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAnnouncementForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Announcement title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Content *
        </label>
        <textarea
          id="content"
          name="content"
          rows={4}
          value={formData.content}
          onChange={handleChange}
          className={`input-field ${errors.content ? 'border-red-500' : ''}`}
          placeholder="Announcement content"
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="input-field"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Announcement'}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
