// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation (Indian format)
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

// PAN validation (Indian format)
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

// Date of birth validation
export const isValidDateOfBirth = (dob: string): boolean => {
  const date = new Date(dob);
  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();
  
  return date instanceof Date && !isNaN(date.getTime()) && age >= 18 && age <= 100;
};

// Name validation
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name) && name.trim().length >= 2 && name.trim().length <= 50;
};

// Address validation
export const isValidAddress = (address: string): boolean => {
  return address.trim().length >= 10 && address.trim().length <= 200;
};

// Mask PAN number for display
export const maskPAN = (pan: string): string => {
  if (!pan || pan.length !== 10) return pan;
  return pan.charAt(0) + '*'.repeat(8) + pan.charAt(9);
};

// Check if PAN is already masked
export const isPANMasked = (pan: string): boolean => {
  return pan.includes('*');
};

// Format date for input
export const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Format date for display
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN');
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('91') && cleaned.length === 12) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Comprehensive form validation
export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  pan?: string;
  dateOfBirth?: string;
  address?: string;
}

export const validateUserForm = (data: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.firstName || !isValidName(data.firstName)) {
    errors.firstName = 'First name must be 2-50 characters and contain only letters and spaces';
  }

  if (!data.lastName || !isValidName(data.lastName)) {
    errors.lastName = 'Last name must be 2-50 characters and contain only letters and spaces';
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid Indian phone number';
  }

  if (!data.pan || !isValidPAN(data.pan)) {
    errors.pan = 'Please enter a valid PAN number (format: ABCDE1234F)';
  }

  if (!data.dateOfBirth || !isValidDateOfBirth(data.dateOfBirth)) {
    errors.dateOfBirth = 'Please enter a valid date of birth (age must be 18-100 years)';
  }

  if (!data.address || !isValidAddress(data.address)) {
    errors.address = 'Address must be 10-200 characters long';
  }

  return errors;
};
