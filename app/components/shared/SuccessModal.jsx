"use client";

import React from "react";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const SuccessModal = ({ isOpen, onClose, title, message, type = "profile" }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "profile":
        return <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />;
      case "2fa":
        return <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />;
      default:
        return <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "profile":
        return "Profile Updated Successfully!";
      case "2fa":
        return "2FA Enabled Successfully!";
      default:
        return "Success!";
    }
  };

  const getMessage = () => {
    if (message) return message;
    switch (type) {
      case "profile":
        return "Your profile has been updated successfully. All changes have been saved.";
      case "2fa":
        return "Two-factor authentication has been enabled for your account.";
      default:
        return "Operation completed successfully.";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Transparent background - shows screen content */}
        <div 
          className="fixed inset-0 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Close button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="text-center">
              {getIcon()}
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {getTitle()}
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {getMessage()}
              </p>
              
              {/* Action button */}
              <button
                onClick={onClose}
                className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
