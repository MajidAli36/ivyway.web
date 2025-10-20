import React, { useRef, useState } from "react";
import { VideoCameraIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function IntroVideoUpload({
  currentVideoUrl,
  onUploadSuccess,
  onVideoRemove,
  loading,
  onError,
  uploadProgress = 0,
}) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const validateVideoFile = (file) => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/webm",
      "video/mkv",
    ];

    if (file.size > maxSize) {
      throw new Error("File size must be less than 50MB");
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Please select a valid video file (MP4, MOV, AVI, WebM, MKV)"
      );
    }

    return true;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setUploading(true);

    try {
      // Validate file first
      validateVideoFile(file);

      const token = localStorage.getItem("jwt_token");
      const formData = new FormData();
      formData.append("introVideo", file);

      // Determine the correct endpoint based on the current URL
      const currentPath = window.location.pathname;
      let endpoint = "/api/student-profiles/profile/intro-video"; // default

      if (currentPath.includes("/tutor/")) {
        endpoint = "/api/tutors/profile/intro-video";
      } else if (currentPath.includes("/counselor/")) {
        endpoint = "/api/counselor-profiles/intro-video";
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let browser set it for FormData
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.message || `Upload failed: ${res.statusText}`
        );
      }

      const data = await res.json();

      if (data.success && data.data?.introVideoUrl) {
        // ✅ Backend returns Cloudinary URL directly
        console.log("Video uploaded successfully:", data.data.introVideoUrl);
        if (onUploadSuccess) onUploadSuccess(data.data);
        setError("");
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (err) {
      console.error("Video upload error:", err);
      setError(err.message || "Upload failed");
      if (onError) onError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleVideoRemove = async () => {
    if (!currentVideoUrl) return;

    setRemoving(true);
    try {
      if (onVideoRemove) {
        await onVideoRemove();
      }
    } catch (err) {
      console.error("Error removing video:", err);
      setError("Failed to remove video");
    } finally {
      setRemoving(false);
    }
  };

  const handleVideoError = (error) => {
    console.error("Video loading error:", error);

    // Check if it's a Cloudinary URL
    if (currentVideoUrl && currentVideoUrl.includes("cloudinary.com")) {
      setError("Video temporarily unavailable. Please try again later.");
    } else {
      setError("Video file not found or corrupted.");
    }
  };

  return (
    <div className="mb-8 w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-56 h-36 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
          {currentVideoUrl ? (
            <video
              src={currentVideoUrl} // ✅ Direct Cloudinary URL
              controls
              className="w-full h-full object-cover rounded-lg"
              preload="metadata"
              onError={handleVideoError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
              <VideoCameraIcon className="h-12 w-12" />
              <span className="text-xs mt-2">No Intro Video</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Intro Video
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a short video introducing yourself to students. This helps
            them get to know you better before booking a session.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
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

          <div className="flex gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/mov,video/avi,video/webm,video/mkv"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading || loading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                uploading || loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>

            {currentVideoUrl && (
              <button
                onClick={handleVideoRemove}
                disabled={removing || loading}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  removing || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {removing ? "Removing..." : "Remove"}
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Supported formats: MP4, MOV, AVI, WebM, MKV (max 50MB)
          </p>
        </div>
      </div>
    </div>
  );
}
