export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
};

export const validateEventForm = (data: any): { valid: boolean; errors: any } => {
  const errors: any = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  }

  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  }

  if (!data.endDate) {
    errors.endDate = 'End date is required';
  }

  if (data.startDate && data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
    errors.endDate = 'End date must be after start date';
  }

  if (!data.location || data.location.trim().length === 0) {
    errors.location = 'Location is required';
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (!data.capacity || data.capacity <= 0) {
    errors.capacity = 'Capacity must be greater than 0';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAnnouncementForm = (data: any): { valid: boolean; errors: any } => {
  const errors: any = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.content = 'Content is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
