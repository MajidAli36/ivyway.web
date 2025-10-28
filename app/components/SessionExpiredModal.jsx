"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ExclamationTriangleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { isAuthPage, isSitePage, isDashboardPage } from "@/app/utils/pageUtils";

export default function SessionExpiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Your session has expired. Please sign in again.");
  const router = useRouter();
  const pathname = usePathname();

  // Only show modal on dashboard pages (not on site pages or auth pages)
  const shouldShowModal = isDashboardPage(pathname) && !isAuthPage(pathname) && !isSitePage(pathname);

  useEffect(() => {
    const handleSessionExpired = (event) => {
      // Only show modal on dashboard pages
      if (!shouldShowModal) {
        console.log(`Session expired event received on ${pathname}, ignoring modal (not a dashboard page)`);
        return;
      }
      
      setMessage(event.detail?.message || "Your session has expired. Please sign in again.");
      setIsOpen(true);
    };

    // Listen for session expiration events
    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [shouldShowModal, pathname]);

  // Close modal if user navigates away from dashboard pages
  useEffect(() => {
    if (!shouldShowModal && isOpen) {
      setIsOpen(false);
    }
  }, [shouldShowModal, isOpen]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");

    // Clear any other auth-related data
    localStorage.removeItem("selectedPlan");
    localStorage.removeItem("selectedCounselingPlan");
    localStorage.removeItem("pendingBooking");
    localStorage.removeItem("selectedService");
    localStorage.removeItem("recentlyBookedSlots");

    // Clear cookies if used
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    setIsOpen(false);
    
    // Redirect to login page
    router.push("/login");
  };

  // Only render the modal on dashboard pages
  if (!shouldShowModal || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleLogout}
        />
        
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">
                  Session Expired
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
              onClick={handleLogout}
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}