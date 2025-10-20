"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null);

  // Handle navigation when redirectPath is set
  useEffect(() => {
    if (redirectPath) {
      router.push(redirectPath);
    }
  }, [redirectPath, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Login with JWT
      const response = await login(formData.email, formData.password);
      console.log("Login user object:", response.user); // Debug log

      // If 2FA is enabled, redirect to /2fa page
      if (response.user.is2FAEnabled || response.user.is_2fa_enabled) {
        setRedirectPath("/2fa");
        return;
      }

      // Redirect based on user role
      let targetPath;
      switch (response.user.role) {
        case "student":
          targetPath = "/student";
          break;
        case "tutor":
          targetPath = "/tutor";
          break;
        case "counselor":
          targetPath = "/counselor";
          break;
        case "teacher":
          targetPath = "/teacher";
          break;
        case "admin":
          targetPath = "/admin";
          break;
        default:
          targetPath = "/student"; // Default fallback
      }

      // Use returnUrl if available, otherwise use targetPath based on role
      const finalPath = returnUrl || targetPath;
      
      // Set redirect path to trigger navigation via useEffect
      setRedirectPath(finalPath);
      
      // Do not reset loading on success; component will unmount on navigation
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError("");

      setError(
        "Google sign-in is not implemented yet. Please use email login."
      );
      setIsGoogleLoading(false);
    } catch (error) {
      setError("Google sign-in is not available at the moment.");
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      setIsFacebookLoading(true);
      setError("");

      setError(
        "Facebook sign-in is not implemented yet. Please use email login."
      );
      setIsFacebookLoading(false);
    } catch (error) {
      setError("Facebook sign-in is not available at the moment.");
      setIsFacebookLoading(false);
    }
  };

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
              <Image
                src="/logo.png"
                alt="logo"
                width={130}
                height={110}
                className="relative z-10 object-contain p-3"
              />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Welcome Back, Learner!
            </h2>
            <p className="mt-2 text-blue-50">
              Sign in to continue your learning journey
            </p>
          </div>
        </div>

        <div className="px-8 py-6 relative">
          <div className="space-y-6">
            {/* Error message display */}
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Social Login Buttons removed */}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 rounded-full">
                 Sign in with email
                </span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="pl-10 appearance-none block w-full px-3 py-3 border border-blue-100 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-blue-200 rounded"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:translate-y-[-1px] hover:cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
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
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              No account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-500 hover:text-blue-600 hover:underline transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
