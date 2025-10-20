import { CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function SessionBanner({ session, userId }) {
  if (!session) return null;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-2">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">
              Upcoming session
            </p>
            <div className="flex items-center text-xs text-blue-600">
              <span className="flex items-center mr-3">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formatDate(session.startTime)}
              </span>
              <span className="flex items-center">
                <ClockIcon className="h-3 w-3 mr-1" />
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </span>
            </div>
          </div>
        </div>
        <Link
          href={`/session/${session.id}`}
          className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md font-medium transition-colors"
        >
          Join
        </Link>
      </div>
    </div>
  );
}
