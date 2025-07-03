import React, { useState, useEffect } from "react";
import { Upload, Download, Users, UserPlus } from "lucide-react";
import { User, CreateUserData, UpdateUserData } from "../types";
import { UserList } from "../components/UserList";
import { UserForm } from "../components/UserForm";
import { BulkUpload } from "../components/BulkUpload";
import * as api from "../services/api";
import toast from "react-hot-toast";

type ViewMode = "list" | "add" | "edit" | "view" | "bulk-upload";

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAllUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error: any) {
      toast.error("Failed to load users");
      console.error("Load users error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setViewMode("add");
  };

  const handleEditUser = async (user: User) => {
    try {
      // Get user with unmasked PAN for editing
      const response = await api.getUserForEdit(user.id);
      if (response.success && response.data) {
        setCurrentUser(response.data);
        setViewMode("edit");
      }
    } catch (error) {
      toast.error("Failed to load user details");
    }
  };

  const handleViewUser = (user: User) => {
    setCurrentUser(user);
    setViewMode("view");
  };

  const handleDeleteUser = async (user: User) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName}?`
      )
    ) {
      return;
    }

    try {
      const response = await api.deleteUser(user.id);
      if (response.success) {
        toast.success("User deleted successfully");
        await loadUsers(); // Reload the list
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleFormSubmit = async (data: CreateUserData | UpdateUserData) => {
    console.log("Form submitted with data:", data);
    console.log("Current view mode:", viewMode);

    setIsSubmitting(true);
    try {
      if (viewMode === "add") {
        console.log("Creating new user...");
        const response = await api.createUser(data as CreateUserData);
        console.log("Create user response:", response);
        if (response.success) {
          toast.success("User created successfully");
          await loadUsers();
          setViewMode("list");
        }
      } else if (viewMode === "edit" && currentUser) {
        console.log("Updating user:", currentUser.id);
        const response = await api.updateUser(
          currentUser.id,
          data as UpdateUserData
        );
        console.log("Update user response:", response);
        if (response.success) {
          toast.success("User updated successfully");
          await loadUsers();
          setViewMode("list");
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      const message =
        error.response?.data?.message ||
        (error.response?.data?.errors &&
          error.response.data.errors.join(", ")) ||
        "Operation failed";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setCurrentUser(null);
    setViewMode("list");
  };

  const handleBulkUpload = () => {
    setViewMode("bulk-upload");
  };

  const handleExportUsers = () => {
    try {
      api.exportUsers();
      toast.success("Export started. Check your downloads.");
    } catch (error) {
      toast.error("Failed to export users");
    }
  };

  const handleBulkUploadComplete = async () => {
    await loadUsers(); // Reload users after bulk upload
  };

  const handleBulkUploadClose = () => {
    setViewMode("list");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" justify-between items-center py-4">
            <div className="flex items-center py-4">
              <Users className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                User Management System
              </h1>
            </div>

            {viewMode === "list" && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleExportUsers}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={users.length === 0}
                >
                  <Download size={16} />
                  Export
                </button>
                <button
                  onClick={handleBulkUpload}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Upload size={16} />
                  Bulk Upload
                </button>
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <UserPlus size={16} />
                  Add User
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === "list" && (
          <UserList
            users={users}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
            onView={handleViewUser}
            onAdd={handleAddUser}
            isLoading={isLoading}
          />
        )}

        {(viewMode === "add" || viewMode === "edit") && (
          <UserForm
            user={currentUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isLoading={isSubmitting}
          />
        )}

        {viewMode === "view" && currentUser && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <div className="space-x-2">
                <button
                  onClick={() => handleEditUser(currentUser)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={handleFormCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Back to List
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <p className="text-lg text-gray-900">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-lg text-gray-900">{currentUser.email}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <p className="text-lg text-gray-900">{currentUser.phone}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PAN Number
                </label>
                <p className="text-lg font-mono text-gray-900">
                  {currentUser.pan}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <p className="text-lg text-gray-900">
                  {new Date(currentUser.dateOfBirth).toLocaleDateString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-lg text-gray-900">
                  {new Date(currentUser.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <p className="text-lg text-gray-900">{currentUser.address}</p>
              </div>
            </div>
          </div>
        )}

        {viewMode === "bulk-upload" && (
          <BulkUpload
            onUploadComplete={handleBulkUploadComplete}
            onClose={handleBulkUploadClose}
          />
        )}
      </main>
    </div>
  );
};

export default UsersPage;
