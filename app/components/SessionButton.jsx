import { useState, useEffect } from "react";
import {
  VideoCameraIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { zoomService } from "../lib/api/zoomService";
import toast from "react-hot-toast";
import apiClient from "../lib/api/client";

export default function SessionButton({ session, userRole = "student" }) {
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [error, setError] = useState(null);
  const [timeStatus, setTimeStatus] = useState("not-available"); // "not-available", "starting-soon", "active", "expired"

  // Check if session already has a meeting link
  const hasExistingLink = session.meetingLink && session.meetingLink !== "#";

  // Calculate session datetime objects for time comparisons
  const sessionStartTime = new Date(`${session.date} ${session.startTime}`);
  const sessionEndTime = new Date(`${session.date} ${session.endTime}`);

  // Update time status based on current time compared to session time
  useEffect(() => {
    const updateTimeStatus = () => {
      const now = new Date();
      const diffMinutesToStart = (sessionStartTime - now) / (1000 * 60);
      const diffMinutesToEnd = (sessionEndTime - now) / (1000 * 60);

      if (diffMinutesToEnd < 0) {
        setTimeStatus("expired");
      } else if (diffMinutesToStart <= 15 && diffMinutesToEnd > 0) {
        setTimeStatus("active");
      } else if (diffMinutesToStart <= 60 && diffMinutesToStart > 15) {
        setTimeStatus("starting-soon");
      } else {
        setTimeStatus("not-available");
      }
    };

    // Initial check
    updateTimeStatus();

    // Update every minute
    const interval = setInterval(updateTimeStatus, 60000);
    return () => clearInterval(interval);
  }, [
    session.date,
    session.startTime,
    session.endTime,
    sessionStartTime,
    sessionEndTime,
  ]);

  // Format session time for display
  const formatSessionTime = () => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.date).toDateString();
    const isToday = today === sessionDate;

    return isToday
      ? `Today at ${session.startTime}`
      : `${new Date(session.date).toLocaleDateString()} at ${
          session.startTime
        }`;
  };

  // Helper to open Zoom meeting in both web and app
  const openZoomMeeting = (meetingUrl) => {
    if (!meetingUrl) {
      toast.error("No meeting link available");
      return;
    }

    // Extract meeting ID from the URL
    const match = meetingUrl.match(/zoom\.us\/j\/(\d+)/);
    const meetingId = match ? match[1] : null;

    // Open Zoom web link
    window.open(meetingUrl, "_blank");

    // Try to open Zoom app (if meetingId is available)
    if (meetingId) {
      // Construct zoommtg:// link
      const zoomAppUrl = `zoommtg://zoom.us/join?confno=${meetingId}`;
      // Create a temporary link and click it
      const a = document.createElement("a");
      a.href = zoomAppUrl;
      // For some browsers, set rel and target
      a.rel = "noopener noreferrer";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Handle joining the session
  const handleJoinSession = () => {
    if (hasExistingLink) {
      openZoomMeeting(session.meetingLink);
      return;
    }

    if (meetingData?.joinUrl) {
      openZoomMeeting(
        userRole === "tutor" ? meetingData.startUrl : meetingData.joinUrl
      );
    } else {
      toast.error("No meeting link available");
    }
  };

  // Create a Zoom meeting for this session
  const createZoomMeeting = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await zoomService.createMeeting(session.id, userRole);
      setMeetingData(response);
      toast.success("Zoom meeting created successfully");
      return response;
    } catch (err) {
      console.error("Failed to create Zoom meeting:", err);
      setError("Could not create Zoom meeting");
      toast.error("Failed to create Zoom meeting");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch existing Zoom meeting data
  useEffect(() => {
    const fetchMeetingData = async () => {
      // Better validation for session.id
      if (
        !session?.id ||
        typeof session.id !== "string" ||
        session.id.trim() === ""
      ) {
        console.log(
          "Invalid session ID, skipping meeting data fetch:",
          session?.id
        );
        return;
      }

      setLoading(true);
      try {
        const data = await zoomService.getMeetingByBookingId(session.id, userRole);
        if (data) {
          setMeetingData(data);
        }
      } catch (err) {
        console.log("No existing Zoom meeting found", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingData();
  }, [session?.id]);

  const getButtonText = () => {
    if (loading) return "Loading...";
    if (error) return "Try Again";

    if (timeStatus === "expired") return "Meeting Expired";
    if (timeStatus === "active") return "Join Now";
    if (timeStatus === "starting-soon") {
      const minutesToStart = Math.ceil(
        (sessionStartTime - new Date()) / (1000 * 60)
      );
      return `Available in ${minutesToStart} min`;
    }

    if (meetingData || hasExistingLink) return "Join Session";
    return userRole === "tutor" ? "Create Meeting" : "Meeting Not Ready";
  };

  const getButtonIcon = () => {
    if (timeStatus === "expired")
      return <ExclamationTriangleIcon className="h-4 w-4 mr-1.5" />;
    if (timeStatus === "starting-soon")
      return <ClockIcon className="h-4 w-4 mr-1.5" />;
    return <VideoCameraIcon className="h-4 w-4 mr-1.5" />;
  };

  const isButtonDisabled = () => {
    if (loading) return true;
    if (timeStatus === "expired") return true;

    // This is the key change - allow both tutors and students to join when session is active
    if (timeStatus === "active") return false;

    // For "not-available" and "starting-soon" states
    if (timeStatus === "starting-soon") return true;
    if (timeStatus === "not-available" && userRole !== "tutor") return true;

    // Meetings must already exist for students to join
    if (userRole !== "tutor" && !meetingData && !hasExistingLink) return true;

    return false;
  };

  // Update the handleButtonClick function for tutors to ensure meeting data is properly stored:
  const handleButtonClick = async () => {
    if (loading || isButtonDisabled()) return;

    if (userRole === "student") {
      setLoading(true);
      toast.loading("Checking for meeting...", { id: "join-check" });
      try {
        // Always fetch the latest join URL for this booking
        console.log("Student attempting to join meeting for session:", session.id);
        const meetingData = await zoomService.getMeetingByBookingId(
          session.id,
          "student"
        );
        console.log("Meeting data retrieved:", meetingData);
        toast.dismiss("join-check");
        if (meetingData && meetingData.joinUrl) {
          console.log("Opening meeting with URL:", meetingData.joinUrl);
          openZoomMeeting(meetingData.joinUrl);
        } else {
          console.log("No meeting data or join URL found");
          toast.error(
            "Meeting not created yet. Please ask your tutor to start the session and click Join Now again."
          );
        }
      } catch (err) {
        toast.dismiss("join-check");
        toast.error("Failed to join meeting. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // If meeting already exists, open immediately
    if (meetingData || hasExistingLink) {
      handleJoinSession();
      return;
    }

    // Only tutors can create meetings
    if (userRole === "tutor") {
      setLoading(true);
      try {
        // Create the meeting
        const response = await zoomService.createMeeting(session.id, userRole);

        if (response?.joinUrl || response?.startUrl) {
          // Store the meeting data in state
          setMeetingData(response);

          // Verify meeting was saved to database by making another request
          // This ensures the backend has registered the meeting
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
          const verifyMeeting = await zoomService.getMeetingByBookingId(
            session.id,
            userRole
          );
          console.log("Verification check for meeting:", verifyMeeting);

          if (!verifyMeeting || !verifyMeeting.joinUrl) {
            console.error("Meeting created but not found in database!");
            // Update database directly with meeting info as fallback
            try {
              // Clean the session ID by removing any prefixes
              const cleanSessionId = session.id.replace(/^(tutor-|student-|counselor-)/, "");
              await apiClient.patch(`/bookings/${cleanSessionId}`, {
                meetingLink: response.joinUrl,
                zoomMeetingId: response.id,
              });
            } catch (error) {
              console.error(
                "Failed to update booking with meeting link:",
                error
              );
            }
          }

          // Open Zoom meeting in new tab
          const url = response.startUrl || response.joinUrl;
          window.open(url, "_blank");

          // Also try Zoom app link
          const match = url.match(/zoom\.us\/j\/(\d+)/);
          const meetingId = match ? match[1] : null;
          if (meetingId) {
            const zoomAppUrl = `zoommtg://zoom.us/join?confno=${meetingId}`;
            const a = document.createElement("a");
            a.href = zoomAppUrl;
            a.rel = "noopener noreferrer";
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
          }
        } else {
          toast.error("Failed to create meeting");
        }
      } catch (err) {
        console.error("Failed to create Zoom meeting:", err);
        toast.error("Failed to create Zoom meeting");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      disabled={isButtonDisabled()}
      className={`
        flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium 
        ${
          timeStatus === "active"
            ? "bg-green-600 hover:bg-green-700 text-white"
            : timeStatus === "expired"
            ? "bg-gray-500 text-white"
            : timeStatus === "starting-soon"
            ? "bg-amber-500 text-white"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }
        ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""}
        transition-all duration-200
      `}
      title={
        timeStatus === "starting-soon"
          ? `Meeting will be available ${formatSessionTime()}`
          : ""
      }
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
  );
}
