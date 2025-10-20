"use client";

import { useState, useEffect } from "react";
import { 
  VideoCameraIcon, 
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import MeetingList from "../../../components/meetings/MeetingList";
import MeetingDetails from "../../../components/meetings/MeetingDetails";
import { zoomService } from "../../../lib/api/zoomService";
import authService from "../../../lib/auth/authService";

export default function CounselorMeetings() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
  });

  // Get counselor ID from auth
  const getCounselorId = () => {
    const user = authService.getUser();
    return user?.id || user?.counselorId;
  };

  // Fetch meetings
  const fetchMeetings = async () => {
    const counselorId = getCounselorId();
    if (!counselorId) {
      setError("Counselor ID not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await zoomService.getCounselorMeetings(counselorId, {
        page: 1,
        limit: 100
      });

      if (response && response.meetings) {
        setMeetings(response.meetings);
        
        // Calculate stats
        const stats = {
          total: response.meetings.length,
          upcoming: response.meetings.filter(m => m.status === "scheduled").length,
          completed: response.meetings.filter(m => m.status === "ended").length,
          cancelled: response.meetings.filter(m => m.status === "cancelled").length
        };
        setStats(stats);
      } else {
        setMeetings([]);
        setStats({ total: 0, upcoming: 0, completed: 0, cancelled: 0 });
      }
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError("Failed to load meetings. Please try again.");
      
      // Use mock data for demonstration
      const mockMeetings = [
        {
          id: "1",
          meetingId: "zoom-123",
          topic: "Academic Counseling Session",
          status: "scheduled",
          startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          duration: 60,
          serviceType: "counseling",
          joinUrl: "https://zoom.us/j/123456789",
          startUrl: "https://zoom.us/s/123456789",
          counselor: { name: "Dr. Jane Smith" },
          student: { name: "John Doe" }
        },
        {
          id: "2",
          meetingId: "zoom-124",
          topic: "Career Guidance Session",
          status: "ended",
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          duration: 90,
          serviceType: "counseling",
          joinUrl: "https://zoom.us/j/123456790",
          startUrl: "https://zoom.us/s/123456790",
          counselor: { name: "Dr. Jane Smith" },
          student: { name: "Alice Johnson" }
        }
      ];
      setMeetings(mockMeetings);
      setStats({ total: 2, upcoming: 1, completed: 1, cancelled: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMeetings();
  }, []);

  // Handle meeting selection
  const handleMeetingSelect = (meeting) => {
    setSelectedMeeting(meeting);
    setShowDetails(true);
  };

  // Handle meeting update
  const handleMeetingUpdate = (updatedMeeting) => {
    setMeetings(prev => 
      prev.map(m => m.id === updatedMeeting.id ? updatedMeeting : m)
    );
    setSelectedMeeting(updatedMeeting);
  };

  // Handle meeting delete
  const handleMeetingDelete = (meetingId) => {
    setMeetings(prev => prev.filter(m => m.id !== meetingId));
    setShowDetails(false);
    setSelectedMeeting(null);
  };

  // Handle close details
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedMeeting(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Meetings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your counseling sessions and Zoom meetings
              </p>
            </div>
            <button
              onClick={fetchMeetings}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <VideoCameraIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Meetings
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CalendarIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Upcoming
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.upcoming}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.completed}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Cancelled
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {loading ? "..." : stats.cancelled}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meetings List */}
        <div className="px-4 py-6 sm:px-0">
          <MeetingList
            userId={getCounselorId()}
            userRole="counselor"
            initialMeetings={meetings}
            onMeetingUpdate={handleMeetingUpdate}
            onMeetingDelete={handleMeetingDelete}
            onMeetingSelect={handleMeetingSelect}
          />
        </div>

        {/* Meeting Details Modal */}
        {selectedMeeting && (
          <MeetingDetails
            meeting={selectedMeeting}
            userRole="counselor"
            isOpen={showDetails}
            onClose={handleCloseDetails}
            onUpdate={handleMeetingUpdate}
            onDelete={handleMeetingDelete}
          />
        )}
      </div>
    </div>
  );
}
