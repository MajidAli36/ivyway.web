import React from "react";
import { CalendarIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

const SessionHistory = ({ sessions }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 bg-purple-600 text-white">
        <h3 className="text-lg font-medium">Recent Tutoring Sessions</h3>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {sessions && sessions.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <li key={session.id} className="py-4">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div className="mb-2 sm:mb-0">
                    <p className="text-sm font-medium text-purple-600">
                      {session.subject}
                    </p>
                    <div className="flex items-center mt-1">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{session.tutor}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {session.date}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {session.duration}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No recent sessions found.
          </p>
        )}

        <div className="mt-4 text-center">
          <a
            href="/student/my-sessions"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            View All Sessions
          </a>
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
