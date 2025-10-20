import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function SessionsHeader({
  totalSessions,
  completedSessions,
  scheduledSessions,
}) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tutoring Sessions</h1>
        {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Schedule New Session
        </button> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-800">
                {totalSessions}
              </p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
              <CalendarIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase">Completed</p>
              <p className="text-2xl font-bold text-gray-800">
                {completedSessions}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-500">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase">Scheduled</p>
              <p className="text-2xl font-bold text-gray-800">
                {scheduledSessions}
              </p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500">
              <ClockIcon className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
