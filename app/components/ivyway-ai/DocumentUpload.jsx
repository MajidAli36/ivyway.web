"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import ivywayAIService from "../../lib/api/ivywayAIService";

const DocumentUpload = ({ userId, onDocumentUploaded, className = "" }) => {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // For demo purposes, skip backend calls and show mock data
    if (process.env.NODE_ENV === "development") {
      setLoading(false);
      setDocuments([
        {
          id: 1,
          filename: "sample-document.pdf",
          size: 1024000,
          status: "processed",
          uploadedAt: new Date().toISOString(),
        },
        {
          id: 2,
          filename: "math-notes.pdf",
          size: 2048000,
          status: "processing",
          uploadedAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    } else {
      loadDocuments();
    }
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await ivywayAIService.getDocuments();
      if (response.success) {
        setDocuments(response.documents || []);
      }
    } catch (error) {
      toast.error("Failed to load documents");
      console.error("Error loading documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (files) => {
    if (files.length === 0) return;

    setUploading(true);

    // Demo mode - simulate file upload
    if (process.env.NODE_ENV === "development") {
      for (const file of files) {
        if (file.type !== "application/pdf") {
          toast.error(`${file.name} is not a PDF file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`);
          continue;
        }

        // Simulate upload delay
        setTimeout(() => {
          const newDocument = {
            id: Date.now() + Math.random(),
            filename: file.name,
            size: file.size,
            status: "processing",
            uploadedAt: new Date().toISOString(),
          };

          setDocuments((prev) => [newDocument, ...prev]);

          if (onDocumentUploaded) {
            onDocumentUploaded(newDocument);
          }

          toast.success(`${file.name} uploaded successfully! (Demo Mode)`);
        }, 1500);
      }

      setUploading(false);
      return;
    }

    // Production mode - real API call
    for (const file of files) {
      try {
        if (file.type !== "application/pdf") {
          toast.error(`${file.name} is not a PDF file`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is too large (max 10MB)`);
          continue;
        }

        const response = await ivywayAIService.uploadDocument(file, userId);

        if (response.success) {
          toast.success(`${file.name} uploaded successfully!`);

          const newDocument = {
            id: response.document_id || Date.now(),
            filename: response.filename || file.name,
            size: response.size || file.size,
            status: response.processing_status || "processing",
            uploadedAt: response.timestamp || new Date().toISOString(),
          };

          setDocuments((prev) => [newDocument, ...prev]);

          if (onDocumentUploaded) {
            onDocumentUploaded(newDocument);
          }
        }
      } catch (error) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    setUploading(false);
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    await handleFiles(files);
    event.target.value = "";
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "processed":
        return <CheckCircleIcon className="w-4 h-4" />;
      case "processing":
        return <ClockIcon className="w-4 h-4" />;
      case "error":
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <DocumentTextIcon className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "processed":
        return "Processed";
      case "processing":
        return "Processing";
      case "error":
        return "Error";
      default:
        return "Unknown";
    }
  };

  if (loading) {
    return (
      <div
        className={`flex justify-center items-center min-h-[200px] ${className}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
            <DocumentArrowUpIcon className="w-8 h-8 text-blue-600" />
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {dragActive ? "Drop PDF files here" : "Upload PDF Documents"}
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop PDF files here, or click to select files
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Maximum file size: 10MB per file
            </p>
            {process.env.NODE_ENV === "development" && (
              <div className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                🚀 Demo Mode - Mock Data
              </div>
            )}
          </div>

          {uploading && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Uploading...</span>
            </div>
          )}
        </div>
      </div>

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Your Documents</h3>

          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
            {documents.map((doc, index) => (
              <div
                key={doc.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {doc.filename}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(doc.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {getStatusIcon(doc.status)}
                      <span className="ml-1">{getStatusText(doc.status)}</span>
                    </span>

                    <button
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4" />
                    </button>

                    <button
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <DocumentTextIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No documents uploaded yet
          </h3>
          <p className="text-gray-600">
            Upload PDF files to get started with AI-powered document analysis
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
