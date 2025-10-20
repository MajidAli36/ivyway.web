"use client";

import { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  VideoCameraIcon,
  UserIcon,
  EllipsisVerticalIcon,
  PlayIcon,
  StopIcon,
  XMarkIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { zoomService } from "../../lib/api/zoomService";

export default function MeetingCard({ 
  meeting, 
  userRole, 
  onUpdate, 
  onDelete, 
  onRemind,
  showActions = true 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
    topic
  } = meeting;

  const statusInfo = zoomService.getStatusInfo(status);
  const isUpcoming = zoomService.isUpcoming(startTime);
  const isActive = zoomService.isActive(startTime, duration);
  const meetingTime = zoomService.formatMeetingTime(startTime, duration);

  const handleJoinMeeting = () => {
    if (userRole === "counselor" && startUrl) {
      zoomService.startMeeting(startUrl);
    } else if (userRole === "student" && joinUrl) {
      zoomService.joinMeeting(joinUrl);
    }
  };

  const handleUpdateMeeting = async () => {
    // This would open an update modal or form
    if (onUpdate) {
      onUpdate(meeting);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!confirm("Are you sure you want to cancel this meeting?")) return;
    
    setIsLoading(true);
    try {
      await zoomService.deleteMeeting(meetingId);
      if (onDelete) {
        onDelete(id);
      }
    } catch (error) {
      console.error("Error deleting meeting:", error);
      alert("Failed to cancel meeting. Please try again.");
    } finally {
      setIsLoading(false);
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

  const canJoin = (userRole === "counselor" && startUrl) || (userRole === "student" && joinUrl);
  const canManage = userRole === "counselor" && (status === "scheduled" || status === "started");
  const canRemind = isUpcoming && (userRole === "counselor" || userRole === "student");

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
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
              {topic || `${serviceType || "Counseling"} Session`}
            </h3>
            
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>
                {userRole === "counselor" 
                  ? `Student: ${student?.name || "Unknown"}`
                  : `Counselor: ${counselor?.name || "Unknown"}`
                }
              </span>
            </div>
          </div>

          {showActions && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <EllipsisVerticalIcon className="h-5 w-5" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    {canJoin && (
                      <button
                        onClick={handleJoinMeeting}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <VideoCameraIcon className="h-4 w-4 mr-2" />
                        {userRole === "counselor" ? "Start Meeting" : "Join Meeting"}
                      </button>
                    )}
                    
                    {canRemind && (
                      <button
                        onClick={handleSendReminder}
                        disabled={isLoading}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <BellIcon className="h-4 w-4 mr-2" />
                        Send Reminder
                      </button>
                    )}
                    
                    {canManage && (
                      <>
                        <button
                          onClick={handleUpdateMeeting}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Update Meeting
                        </button>
                        
                        <button
                          onClick={handleDeleteMeeting}
                          disabled={isLoading}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
                        >
                          <XMarkIcon className="h-4 w-4 mr-2" />
                          Cancel Meeting
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meeting Details */}
        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600">
            <CalendarIcon className="h-4 w-4 mr-2" />
            <span>{meetingTime}</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2" />
            <span>{duration} minutes</span>
          </div>

          {/* Meeting Links */}
          {canJoin && (
            <div className="pt-3 border-t border-gray-100">
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
    </div>
  );
}
