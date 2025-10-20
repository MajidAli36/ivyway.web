"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  BellIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { zoomService } from "../../lib/api/zoomService";

export default function MeetingDetails({ 
  meeting, 
  userRole, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const {
    id,
    meetingId,
    joinUrl,
    startUrl,
    status,
    startTime,
    duration,
    serviceType,
    counselor,
    student,
    topic,
    password,
    settings
  } = meeting;

  const statusInfo = zoomService.getStatusInfo(status);
  const isUpcoming = zoomService.isUpcoming(startTime);
  const isActive = zoomService.isActive(startTime, duration);
  const meetingTime = zoomService.formatMeetingTime(startTime, duration);

  // Initialize edit data
  useEffect(() => {
    if (meeting) {
      setEditData({
        topic: topic || "",
        duration: duration || 60,
        settings: settings || {
          host_video: true,
          participant_video: true,
          waiting_room: true
        }
      });
    }
  }, [meeting]);

  const handleJoinMeeting = () => {
    if (userRole === "counselor" && startUrl) {
      zoomService.startMeeting(startUrl);
    } else if (userRole === "student" && joinUrl) {
      zoomService.joinMeeting(joinUrl);
    }
  };

  const handleSendReminder = async () => {
    setIsLoading(true);
    try {
      await zoomService.sendReminder(meeting.bookingId || id);
      alert("Meeting reminder sent successfully!");
    } catch (error) {
      console.error("Error sending reminder:", error);
      alert("Failed to send reminder. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await zoomService.updateMeeting(meetingId, editData);
      if (onUpdate) {
        onUpdate({ ...meeting, ...editData });
      }
      setIsEditing(false);
      alert("Meeting updated successfully!");
    } catch (error) {
      console.error("Error updating meeting:", error);
      alert("Failed to update meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!confirm("Are you sure you want to cancel this meeting? This action cannot be undone.")) return;
    
    setIsLoading(true);
    try {
      await zoomService.deleteMeeting(meetingId);
      if (onDelete) {
        onDelete(id);
      }
      onClose();
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Failed to cancel meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const canJoin = (userRole === "counselor" && startUrl) || (userRole === "student" && joinUrl);
  const canManage = userRole === "counselor" && (status === "scheduled" || status === "started");
  const canRemind = isUpcoming && (userRole === "counselor" || userRole === "student");

  if (!isOpen || !meeting) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-white/30 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                  {isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Live
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.topic}
                      onChange={(e) => setEditData(prev => ({ ...prev, topic: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Meeting title"
                    />
                  ) : (
                    topic || `${serviceType || "Counseling"} Session`
                  )}
                </h3>
              </div>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-4 pb-4 sm:p-6">
            <div className="space-y-4">
              {/* Meeting Time */}
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-3" />
                <span>{meetingTime}</span>
              </div>

              {/* Duration */}
              <div className="flex items-center text-sm text-gray-600">
                <ClockIcon className="h-4 w-4 mr-3" />
                <span>
                  {isEditing ? (
                    <select
                      value={editData.duration}
                      onChange={(e) => setEditData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={30}>30 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>120 minutes</option>
                    </select>
                  ) : (
                    `${duration} minutes`
                  )}
                </span>
              </div>

              {/* Participants */}
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-3" />
                <span>
                  {userRole === "counselor" 
                    ? `Student: ${student?.name || "Unknown"}`
                    : `Counselor: ${counselor?.name || "Unknown"}`
                  }
                </span>
              </div>

              {/* Meeting Settings (for counselors) */}
              {userRole === "counselor" && isEditing && (
                <div className="space-y-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900">Meeting Settings</h4>
                  
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editData.settings.host_video}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, host_video: e.target.checked }
                        }))}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Host video on by default</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editData.settings.participant_video}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, participant_video: e.target.checked }
                        }))}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Participant video on by default</span>
                    </label>
                    
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={editData.settings.waiting_room}
                        onChange={(e) => setEditData(prev => ({
                          ...prev,
                          settings: { ...prev.settings, waiting_room: e.target.checked }
                        }))}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Enable waiting room</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Meeting Password */}
              {password && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm font-medium text-gray-900 mb-1">Meeting Password</p>
                  <p className="text-sm text-gray-600 font-mono">{password}</p>
                </div>
              )}

              {/* Meeting Links */}
              {canJoin && (
                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={handleJoinMeeting}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } disabled:opacity-50`}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        {isActive ? (
                          <>
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Join Live Meeting
                          </>
                        ) : (
                          <>
                            <VideoCameraIcon className="h-4 w-4 mr-2" />
                            {userRole === "counselor" ? "Start Meeting" : "Join Meeting"}
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveChanges}
                    disabled={isLoading}
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {canManage && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit
                    </button>
                  )}
                  
                  {canRemind && (
                    <button
                      onClick={handleSendReminder}
                      disabled={isLoading}
                      className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                    >
                      <BellIcon className="h-4 w-4 mr-2" />
                      Send Reminder
                    </button>
                  )}
                  
                  {canManage && (
                    <button
                      onClick={handleDeleteMeeting}
                      disabled={isLoading}
                      className="w-full sm:w-auto inline-flex justify-center rounded-md border border-red-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Cancel Meeting
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
