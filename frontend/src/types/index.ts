export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pan: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pan: string;
  dateOfBirth: string;
  address: string;
}

export interface UpdateUserData extends Partial<CreateUserData> {}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface BulkUploadResponse {
  success: boolean;
  message: string;
  summary: {
    totalProcessed: number;
    successful: number;
    failed: number;
  };
  createdUsers: User[];
  errors: {
    row: number;
    email: string;
    error?: string;
    errors?: string[];
  }[];
}

export interface UserStats {
  totalUsers: number;
  recentUsers: number;
}

export interface SearchResult {
  success: boolean;
  data: User[];
  count: number;
}
