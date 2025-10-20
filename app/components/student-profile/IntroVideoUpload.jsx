import React, { useState, useRef } from "react";
import {
  VideoCameraIcon,
  XMarkIcon,
  PlayIcon,
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
// Temporarily hardcoded functions to isolate import issues
const validateStudentFileUpload = (file, allowedTypes, maxSizeMB) => {
  const errors = [];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`
    );
  }

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size too large. Maximum size: ${maxSizeMB}MB`);
  }

  return errors;
};

const FILE_UPLOAD_CONSTANTS = {
  PROFILE_IMAGE: {
    MAX_SIZE_MB: 5,
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
    ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".gif"],
  },
  INTRO_VIDEO: {
    MAX_SIZE_MB: 50,
    ALLOWED_TYPES: [
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/webm",
      "video/mkv",
    ],
    ALLOWED_EXTENSIONS: [".mp4", ".mov", ".avi", ".webm", ".mkv"],
  },
};

const IntroVideoUpload = ({
  currentVideoUrl,
  onVideoUpload,
  isUploading = false,
  uploadProgress = 0,
  error = null,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    setValidationError(null);

    // Validate file
    const errors = validateStudentFileUpload(
      file,
      FILE_UPLOAD_CONSTANTS.INTRO_VIDEO.ALLOWED_TYPES,
      FILE_UPLOAD_CONSTANTS.INTRO_VIDEO.MAX_SIZE_MB
    );

    if (errors.length > 0) {
      setValidationError(errors[0]);
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await onVideoUpload(selectedFile);
      // Clear local state after successful upload
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Video upload failed:", error);
      // Error handling is done in the parent component
    }
  };

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);

    // Check if it's a Cloudinary URL
    if (videoUrl && videoUrl.includes("cloudinary.com")) {
      console.error("Video temporarily unavailable. Please try again later.");
    } else {
      console.error("Video file not found or corrupted.");
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getVideoDisplay = () => {
    const videoUrl = previewUrl || currentVideoUrl;

    if (!videoUrl) return null;

    return (
      <div className="relative group">
        <video
          className="w-full h-48 object-cover rounded-lg"
          controls
          preload="metadata"
          onError={handleVideoError}
        >
          <source src={videoUrl} type="video/mp4" />{" "}
          {/* ✅ Direct Cloudinary URL */}
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
          <PlayIcon className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Intro Video</h3>
        <div className="text-sm text-gray-500">
          Max {FILE_UPLOAD_CONSTANTS.INTRO_VIDEO.MAX_SIZE_MB}MB
        </div>
      </div>

      {/* Error Display */}
      {(error || validationError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error || validationError}</p>
          </div>
        </div>
      )}

      {/* Video Preview */}
      {getVideoDisplay() && (
        <div className="mb-4">
          {getVideoDisplay()}
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)}
              )
            </div>
          )}
        </div>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!currentVideoUrl && !selectedFile && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-sm text-gray-600 mb-2">
            <span className="font-medium text-blue-600 hover:text-blue-500">
              Click to upload
            </span>{" "}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            MP4, MOV, AVI, WebM, MKV up to{" "}
            {FILE_UPLOAD_CONSTANTS.INTRO_VIDEO.MAX_SIZE_MB}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={FILE_UPLOAD_CONSTANTS.INTRO_VIDEO.ALLOWED_TYPES.join(",")}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-4">
        {!currentVideoUrl && !selectedFile && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <VideoCameraIcon className="h-5 w-5 mr-2" />
            Choose Video
          </button>
        )}

        {selectedFile && (
          <>
            <button
              type="button"
              onClick={handleUpload}
              disabled={isUploading}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : "Upload Video"}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </>
        )}

        {currentVideoUrl && !selectedFile && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Replace Video
          </button>
        )}
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Upload a short video introducing yourself to help tutors get to know
          you better. This will help you find the perfect tutor match!
        </p>
      </div>
    </div>
  );
};

export default IntroVideoUpload;
