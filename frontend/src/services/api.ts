import axios from 'axios';
import {
  User,
  CreateUserData,
  UpdateUserData,
  ApiResponse,
  BulkUploadResponse,
  UserStats,
  SearchResult
} from '../types';

// Base URL setup
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/users';

// Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  const response = await api.get('/');
  return response.data;
};

export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const getUserForEdit = async (id: number): Promise<ApiResponse<User>> => {
  // For editing, we need the actual PAN data from the server (unmasked)
  const response = await api.get(`/${id}?unmask=true`);
  return response.data;
};

export const createUser = async (userData: CreateUserData): Promise<ApiResponse<User>> => {
  const response = await api.post('/', userData);
  return response.data;
};

export const updateUser = async (id: number, userData: UpdateUserData): Promise<ApiResponse<User>> => {
  const response = await api.put(`/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: number): Promise<ApiResponse<User>> => {
  const response = await api.delete(`/${id}`);
  return response.data;
};

export const bulkUploadUsers = async (file: File): Promise<BulkUploadResponse> => {
  const formData = new FormData();
  formData.append('excelFile', file);
  const response = await api.post('/excel/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const downloadTemplate = (): void => {
  window.open(`${API_URL}/excel/template`, '_blank');
};

export const exportUsers = (): void => {
  window.open(`${API_URL}/excel/export`, '_blank');
};

export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  const response = await api.get('/stats');
  return response.data;
};

export const searchUsers = async (query: string): Promise<SearchResult> => {
  const response = await api.get(`/search?query=${query}`);
  return response.data;
};

