"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { connectApi } from "@/app/lib/stripe/api";
import { useAuth } from "@/app/providers/AuthProvider";

const StripeReturnPage = () => {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your account details...");
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  useEffect(() => {
    const verifyOnboarding = async () => {
      try {
        await connectApi.handleOnboardingReturn();
        await refreshUser(); // Refresh user data to get updated Stripe status
        setStatus("success");
        setMessage(
          "Your account has been successfully connected. You will be redirected shortly."
        );

        setTimeout(() => {
          if (user?.role === "tutor") {
            router.push("/dashboard/tutor/earnings");
          } else if (user?.role === "counselor") {
            router.push("/dashboard/counselor/profile");
          } else {
            router.push("/dashboard");
          }
        }, 3000);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.message ||
            "An error occurred while verifying your account. Please try again."
        );
        setTimeout(() => {
          if (user?.role === "tutor") {
            router.push("/dashboard/tutor/earnings");
          } else if (user?.role === "counselor") {
            router.push("/dashboard/counselor/profile");
          } else {
            router.push("/dashboard");
          }
        }, 5000);
      }
    };

    verifyOnboarding();
  }, [router, user?.role, refreshUser]);

  const getStatusColor = () => {
    switch (status) {
      case "verifying":
        return "text-blue-500";
      case "success":
        return "text-green-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
          {status === "verifying" && "Verifying..."}
          {status === "success" && "Success!"}
          {status === "error" && "Error"}
        </h1>
        <p className="text-gray-600">{message}</p>
        {status === "verifying" && (
          <div className="mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeReturnPage;
