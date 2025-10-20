import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

export default function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-500" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          No conversation selected
        </h3>
        <p className="text-gray-600 mb-4">
          Select a conversation from the sidebar or start a new one to begin
          messaging.
        </p>

        <div className="mt-6 text-sm text-gray-500">
          <p>Need help? Contact support at:</p>
          <p className="font-medium">support@ivyway.com</p>
        </div>
      </div>
    </div>
  );
}
