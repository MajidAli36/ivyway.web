"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/providers/AuthProvider";

// Dynamically import the Image component with no SSR
const Image = dynamic(() => import("next/image"), { ssr: false });

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Only render component content after it's mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // Call Firebase password reset
      await resetPassword(email);

      // Show success state
      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);

      // Handle Firebase specific errors
      if (error.code === "auth/user-not-found") {
        setError("We couldn't find an account with that email address.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/missing-email") {
        setError("Please enter your email address.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (error.code === "auth/network-request-failed") {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else {
        setError("We couldn't process your request. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // If not mounted (client-side), render a placeholder or nothing
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-200 to-blue-100 rounded-b-[50%] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-l from-blue-100 to-blue-200 rounded-t-[50%] opacity-30"></div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-blue-100 rounded-full opacity-40 animate-float"></div>
      <div className="absolute bottom-20 right-20 w-20 h-20 bg-blue-50 rounded-full opacity-40 animate-float-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-blue-100 rounded-full opacity-30 animate-float-delayed"></div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden relative z-10">
        <div className="px-8 pt-8 pb-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-center relative">
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-200 opacity-20"></div>
          <div className="relative z-10">
            <div className="relative mx-auto h-32 w-32 mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-100 to-white opacity-90 shadow-lg"></div>
              <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white to-blue-50"></div>
              {mounted && (
                <Image
                  src="/logo.png"
                  alt="logo"
                  width={130}
                  height={110}
                  className="relative z-10 object-contain p-3"
                />
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Forgot Your Password?
            </h2>
            <p className="mt-2 text-blue-50">
              No worries! We'll send you password reset instructions
            </p>
          </div>
        </div>

        <div className="px-8 py-6 relative">
          {!isSubmitted ? (
            <div className="space-y-6">
              <p className="text-gray-600 text-sm">
                Enter the email address associated with your account, and we'll
                email you a link to reset your password.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10 appearance-none block w-full px-3 py-3 border border-blue-100 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-all"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:translate-y-[-1px]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Reset Instructions"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Check your email
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                We've sent password reset instructions to:
              </p>
              <p className="mt-1 font-medium text-blue-600">{email}</p>
              <p className="mt-4 text-sm text-gray-500">
                If you don't see it in your inbox, please check your spam
                folder.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
