"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ProtectedRoute({
  children,
  allowedRoles = ["student", "tutor", "counselor", "teacher"],
}) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const [accessError, setAccessError] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      } else if (user) {
        // Normalize roles to avoid case/whitespace mismatches from backend/localStorage
        const normalizedAllowed = allowedRoles.map((r) => r.toString().toLowerCase().trim());
        const userRole = (user.role || user.Role || user.userRole || "")
          .toString()
          .toLowerCase()
          .trim();

        if (userRole && normalizedAllowed.includes(userRole)) {
          setAuthorized(true);
          setAccessError(null);
        } else if (userRole) {
          setAuthorized(false);
          setAccessError(
            `You don't have permission to access this area. This section is restricted to ${allowedRoles.join(
              ", "
            )} roles.`
          );
        } else {
          setAuthorized(false);
          setAccessError("User role could not be determined.");
        }
      } else {
        setAuthorized(false);
        setAccessError("User role could not be determined.");
      }
    }
  }, [isAuthenticated, authLoading, user, router, pathname, allowedRoles]);

  if (accessError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 text-center mb-6">{accessError}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href={user?.role ? `/${user.role}` : "/"}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
            >
              {user?.role ? `Go to your dashboard` : "Return home"}
            </Link>
            <button
              onClick={() => router.back()}
              className="px-5 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-t-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authorized) {
    return children;
  }

  return null;
}
