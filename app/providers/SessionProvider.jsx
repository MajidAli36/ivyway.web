"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isAuthPage, isSitePage, isDashboardPage } from "@/app/utils/pageUtils";

const SessionContext = createContext({});

export const useSession = () => useContext(SessionContext);

export default function SessionProvider({ children }) {
  const [sessionExpired, setSessionExpired] = useState(false);
  const [sessionMessage, setSessionMessage] = useState("");
  const pathname = usePathname();

  // Determine if we should show session expired modal
  const shouldShowModal = isDashboardPage(pathname) && !isAuthPage(pathname) && !isSitePage(pathname);

  useEffect(() => {
    const handleSessionExpired = (event) => {
      if (shouldShowModal) {
        setSessionMessage(event.detail?.message || "Your session has expired. Please sign in again.");
        setSessionExpired(true);
      } else {
        console.log(`Session expired event ignored on ${pathname} (not a dashboard page)`);
      }
    };

    // Listen for session expiration events
    window.addEventListener('sessionExpired', handleSessionExpired);

    return () => {
      window.removeEventListener('sessionExpired', handleSessionExpired);
    };
  }, [shouldShowModal, pathname]);

  // Clear session expired state when navigating away from dashboard pages
  useEffect(() => {
    if (!shouldShowModal && sessionExpired) {
      setSessionExpired(false);
      setSessionMessage("");
    }
  }, [shouldShowModal, sessionExpired]);

  const clearSessionExpired = () => {
    setSessionExpired(false);
    setSessionMessage("");
  };

  const value = {
    sessionExpired,
    sessionMessage,
    shouldShowModal,
    clearSessionExpired,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
