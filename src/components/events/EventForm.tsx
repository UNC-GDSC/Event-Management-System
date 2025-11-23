import React, { useState } from 'react';
import type { Event, EventFormData } from '../../types';
import { validateEventForm } from '../../utils/validation';
import { FiUpload, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface EventFormProps {
  event?: Event;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const categories = [
  'Conference',
  'Workshop',
  'Seminar',
  'Meetup',
  'Social',
  'Sports',
  'Arts',
  'Education',
  'Technology',
  'Other',
];

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate
      ? new Date(event.startDate).toISOString().slice(0, 16)
      : '',
    endDate: event?.endDate
      ? new Date(event.endDate).toISOString().slice(0, 16)
      : '',
    location: event?.location || '',
    category: event?.category || '',
    capacity: event?.capacity || 50,
    tags: event?.tags || [],
  });

  const [tagInput, setTagInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl || null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev: any) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateEventForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save event');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className={`input-field ${errors.title ? 'border-red-500' : ''}`}
          placeholder="Enter event title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className={`input-field ${errors.description ? 'border-red-500' : ''}`}
          placeholder="Describe your event"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
            Start Date & Time *
          </label>
          <input
            id="startDate"
            name="startDate"
            type="datetime-local"
            value={formData.startDate}
            onChange={handleChange}
            className={`input-field ${errors.startDate ? 'border-red-500' : ''}`}
          />
          {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
            End Date & Time *
          </label>
          <input
            id="endDate"
            name="endDate"
            type="datetime-local"
            value={formData.endDate}
            onChange={handleChange}
            className={`input-field ${errors.endDate ? 'border-red-500' : ''}`}
          />
          {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          className={`input-field ${errors.location ? 'border-red-500' : ''}`}
          placeholder="Event venue or address"
        />
        {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`input-field ${errors.category ? 'border-red-500' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            Capacity *
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={handleChange}
            className={`input-field ${errors.capacity ? 'border-red-500' : ''}`}
          />
          {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
        {imagePreview ? (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <FiUpload className="mx-auto text-4xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Click to upload image</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
            </label>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            className="input-field flex-1"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="btn-secondary"
          >
            Add
          </button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-primary-600 hover:text-primary-800"
                >
                  <FiX />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
