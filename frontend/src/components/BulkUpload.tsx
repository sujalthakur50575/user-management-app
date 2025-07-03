import React, { useState, useRef } from 'react';
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle, X } from 'lucide-react';
import { BulkUploadResponse } from '../types';
import { bulkUploadUsers, downloadTemplate } from '../services/api';
import toast from 'react-hot-toast';

interface BulkUploadProps {
  onUploadComplete: () => void;
  onClose: () => void;
}

export const BulkUpload: React.FC<BulkUploadProps> = ({ onUploadComplete, onClose }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkUploadResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/i)) {
      toast.error('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const result = await bulkUploadUsers(file);
      setUploadResult(result);
      
      if (result.summary.successful > 0) {
        toast.success(`Successfully uploaded ${result.summary.successful} users!`);
        onUploadComplete();
      }
      
      if (result.summary.failed > 0) {
        toast.error(`${result.summary.failed} users failed to upload. Check details below.`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTemplate = () => {
    try {
      downloadTemplate();
      toast.success('Template downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download template');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Bulk Upload Users</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Instructions</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• Download the Excel template and fill in user data</li>
                <li>• Ensure all required fields are filled correctly</li>
                <li>• PAN numbers should be in format: ABCDE1234F</li>
                <li>• Phone numbers should be valid Indian numbers</li>
                <li>• Date of birth should be valid (age 18-100 years)</li>
                <li>• File size should be less than 5MB</li>
              </ul>
            </div>
          </div>

          {/* Download Template */}
          <div className="mb-6">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <Download size={16} />
              Download Excel Template
            </button>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="text-lg font-medium text-gray-700 mb-2">
                Drop your Excel file here or click to browse
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Supports .xlsx and .xls files up to 5MB
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload size={16} />
                    Select File
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Upload Results */}
          {uploadResult && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Upload Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{uploadResult.summary.totalProcessed}</div>
                    <div className="text-sm text-gray-600">Total Processed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{uploadResult.summary.successful}</div>
                    <div className="text-sm text-gray-600">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{uploadResult.summary.failed}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>
              </div>

              {/* Successful Users */}
              {uploadResult.createdUsers.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="text-green-600" size={20} />
                    <h4 className="font-semibold text-green-800">Successfully Created Users</h4>
                  </div>
                  <div className="space-y-2">
                    {uploadResult.createdUsers.slice(0, 5).map(user => (
                      <div key={user.id} className="text-sm text-green-700">
                        {user.firstName} {user.lastName} ({user.email})
                      </div>
                    ))}
                    {uploadResult.createdUsers.length > 5 && (
                      <div className="text-sm text-green-600">
                        ... and {uploadResult.createdUsers.length - 5} more users
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Errors */}
              {uploadResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <h4 className="font-semibold text-red-800">Upload Errors</h4>
                  </div>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {uploadResult.errors.map((error, index) => (
                      <div key={index} className="border-b border-red-200 pb-2 last:border-b-0">
                        <div className="text-sm font-medium text-red-800">
                          Row {error.row}: {error.email}
                        </div>
                        <div className="text-sm text-red-700">
                          {error.error || (error.errors && error.errors.join(', '))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
