import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ChatHeader({
  user,
  userRole,
  isMobileView,
  onBackToList,
}) {
  const roleLabel = userRole === "tutor" ? "Tutor" : "Student";
  const isOnline = user?.online || false;

  return (
    <div className="flex items-center px-4 py-3 bg-white border-b border-gray-200">
      {isMobileView && (
        <button
          onClick={onBackToList}
          className="mr-2 p-1 rounded-full hover:bg-gray-100"
          aria-label="Back to conversations"
        >
          <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
        </button>
      )}

      <div className="relative flex-shrink-0">
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
          {user?.name?.charAt(0) || "?"}
        </div>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5">
            <div className="h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
          </div>
        )}
      </div>

      <div className="ml-3 flex-grow">
        <h3 className="font-medium text-gray-900">{user?.name || "Unknown"}</h3>
        <p className="text-xs text-gray-500 flex items-center">
          {roleLabel}
          {isOnline && (
            <span className="ml-2 flex items-center text-green-500">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
              Online
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
