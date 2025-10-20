"use client";

import { useEffect, useState } from "react";
import { zoomService } from "../../lib/api/zoomService";
import { useMeetingNotifications } from "./MeetingNotificationProvider";

export default function MeetingNotificationHandler({ userRole, userId }) {
  const [lastCheckTime, setLastCheckTime] = useState(new Date());
  const { addNotification } = useMeetingNotifications();

  // Check for meeting reminders and status changes
  useEffect(() => {
    if (!userId || !userRole) return;

    const checkMeetingNotifications = async () => {
      try {
        // Get upcoming meetings
        const response = userRole === "counselor" 
          ? await zoomService.getCounselorMeetings(userId, { 
              page: 1, 
              limit: 10, 
              status: "scheduled" 
            })
          : await zoomService.getStudentMeetings(userId, { 
              page: 1, 
              limit: 10, 
              status: "scheduled" 
            });

        if (response && response.meetings) {
          const now = new Date();
          const upcomingMeetings = response.meetings.filter(meeting => {
            const meetingTime = new Date(meeting.startTime);
            const timeDiff = meetingTime.getTime() - now.getTime();
            const minutesUntilMeeting = timeDiff / (1000 * 60);
            
            // Check if meeting is starting in 10 minutes or less
            return minutesUntilMeeting <= 10 && minutesUntilMeeting > 0;
          });

          // Show notifications for meetings starting soon
          upcomingMeetings.forEach(meeting => {
            const meetingTime = new Date(meeting.startTime);
            const timeDiff = meetingTime.getTime() - now.getTime();
            const minutesUntilMeeting = Math.ceil(timeDiff / (1000 * 60));

            if (minutesUntilMeeting <= 10 && minutesUntilMeeting > 0) {
              addNotification({
                type: "meeting_reminder",
                title: "Meeting Starting Soon",
                message: `${meeting.topic || "Your meeting"} starts in ${minutesUntilMeeting} minutes`,
                data: {
                  meetingId: meeting.id,
                  joinUrl: meeting.joinUrl,
                  startUrl: meeting.startUrl,
                  userRole
                },
                actions: [
                  {
                    label: userRole === "counselor" ? "Start Meeting" : "Join Meeting",
                    action: () => {
                      if (userRole === "counselor" && meeting.startUrl) {
                        zoomService.startMeeting(meeting.startUrl);
                      } else if (userRole === "student" && meeting.joinUrl) {
                        zoomService.joinMeeting(meeting.joinUrl);
                      }
                    }
                  }
                ]
              });
            }
          });
        }
      } catch (error) {
        console.error("Error checking meeting notifications:", error);
      }
    };

    // Check every minute
    const interval = setInterval(checkMeetingNotifications, 60000);
    
    // Initial check
    checkMeetingNotifications();

    return () => clearInterval(interval);
  }, [userId, userRole, addNotification]);

  // Handle meeting status changes
  useEffect(() => {
    if (!userId || !userRole) return;

    const handleMeetingStatusChange = (meeting) => {
      const statusMessages = {
        started: "Your meeting has started",
        ended: "Your meeting has ended",
        cancelled: "Your meeting has been cancelled"
      };

      if (statusMessages[meeting.status]) {
        addNotification({
          type: "meeting_status",
          title: "Meeting Update",
          message: `${meeting.topic || "Your meeting"} - ${statusMessages[meeting.status]}`,
          data: {
            meetingId: meeting.id,
            status: meeting.status
          }
        });
      }
    };

    // This would typically be connected to a WebSocket or real-time service
    // For now, we'll simulate it with a simple interval check
    const statusCheckInterval = setInterval(async () => {
      try {
        const response = userRole === "counselor" 
          ? await zoomService.getCounselorMeetings(userId, { 
              page: 1, 
              limit: 5, 
              status: "started" 
            })
          : await zoomService.getStudentMeetings(userId, { 
              page: 1, 
              limit: 5, 
              status: "started" 
            });

        if (response && response.meetings) {
          response.meetings.forEach(meeting => {
            // Check if this is a new status change
            const lastKnownStatus = localStorage.getItem(`meeting_${meeting.id}_status`);
            if (lastKnownStatus && lastKnownStatus !== meeting.status) {
              handleMeetingStatusChange(meeting);
            }
            localStorage.setItem(`meeting_${meeting.id}_status`, meeting.status);
          });
        }
      } catch (error) {
        console.error("Error checking meeting status:", error);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(statusCheckInterval);
  }, [userId, userRole, addNotification]);

  return null; // This component doesn't render anything
}
