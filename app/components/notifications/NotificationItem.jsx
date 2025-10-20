"use client";

import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XCircleIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  AcademicCapIcon,
  CalendarIcon,
  ChatBubbleLeftIcon
} from "@heroicons/react/24/outline";
import { formatDistanceToNow } from "date-fns";

export default function NotificationItem({ 
  notification, 
  compact = false, 
  showActions = true,
  onMarkAsRead
}) {
  const getNotificationIcon = (type) => {
    switch (type) {
      case "teacher_profile_approved":
      case "student_referral_approved":
      case "teacher_assignment_approved":
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      
      case "teacher_profile_rejected":
      case "student_referral_rejected":
      case "teacher_assignment_rejected":
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      
      case "teacher_profile_created":
      case "student_referral_created":
      case "teacher_assignment_created":
        return <UserPlusIcon className="h-5 w-5 text-blue-500" />;
      
      case "teacher_assignment_updated":
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      
      case "teacher_assignment_cancelled":
        return <ExclamationTriangleIcon className="h-5 w-5 text-orange-500" />;
      
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "teacher_profile_approved":
      case "student_referral_approved":
      case "teacher_assignment_approved":
        return "bg-green-50 border-green-200";
      
      case "teacher_profile_rejected":
      case "student_referral_rejected":
      case "teacher_assignment_rejected":
        return "bg-red-50 border-red-200";
      
      case "teacher_profile_created":
      case "student_referral_created":
      case "teacher_assignment_created":
        return "bg-blue-50 border-blue-200";
      
      case "teacher_assignment_updated":
        return "bg-blue-50 border-blue-200";
      
      case "teacher_assignment_cancelled":
        return "bg-orange-50 border-orange-200";
      
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getActionButton = (type, metadata) => {
    switch (type) {
      case "teacher_profile_approved":
      case "teacher_profile_rejected":
        return { text: "View Profile", href: "/teacher/profile" };
      
      case "student_referral_approved":
      case "student_referral_rejected":
        return { text: "View Students", href: "/teacher/students" };
      
      case "teacher_assignment_approved":
      case "teacher_assignment_rejected":
      case "teacher_assignment_updated":
      case "teacher_assignment_cancelled":
        return { text: "View Assignments", href: "/teacher/assignments" };
      
      default:
        return null;
    }
  };

  const formatNotificationContent = (notification) => {
    const { type, content, metadata } = notification;
    
    // Replace placeholders in content with actual metadata values
    let formattedContent = content;
    
    if (metadata) {
      Object.keys(metadata).forEach(key => {
        const placeholder = `{${key}}`;
        if (formattedContent.includes(placeholder)) {
          formattedContent = formattedContent.replace(
            new RegExp(placeholder, 'g'), 
            metadata[key] || ''
          );
        }
      });
    }
    
    return formattedContent;
  };

  const actionButton = getActionButton(notification.type, notification.metadata);

  if (compact) {
    return (
      <div className={`flex items-start space-x-3 ${!notification.isRead ? 'bg-blue-50' : ''}`}>
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
            {notification.title}
          </p>
          <p className={`text-xs ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'} mt-1`}>
            {formatNotificationContent(notification)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
          </p>
        </div>
        {!notification.isRead && (
          <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 mt-2"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
      !notification.isRead ? 'ring-2 ring-blue-100 border-blue-200' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <div className={`p-2 rounded-full ${!notification.isRead ? 'bg-blue-50' : 'bg-gray-50'}`}>
              {getNotificationIcon(notification.type)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`text-base font-semibold ${
                  !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {notification.title}
                </h3>
                <p className={`mt-2 text-sm leading-relaxed ${
                  !notification.isRead ? 'text-gray-800' : 'text-gray-600'
                }`}>
                  {formatNotificationContent(notification)}
                </p>

                {/* Show metadata if available */}
                {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {notification.metadata.teacherName && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        Teacher: {notification.metadata.teacherName}
                      </span>
                    )}
                    {notification.metadata.studentName && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                        Student: {notification.metadata.studentName}
                      </span>
                    )}
                    {notification.metadata.assignmentType && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        Assignment: {notification.metadata.assignmentType}
                      </span>
                    )}
                    {notification.metadata.schoolName && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                        School: {notification.metadata.schoolName}
                      </span>
                    )}
                  </div>
                )}

                {showActions && (
                  <div className="mt-4 flex items-center space-x-4">
                    {!notification.isRead && onMarkAsRead && (
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        Mark as read
                      </button>
                    )}
                    
                    {actionButton && (
                      <a
                        href={actionButton.href}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        {actionButton.text}
                      </a>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3 ml-4">
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </span>
                {!notification.isRead && (
                  <div className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
