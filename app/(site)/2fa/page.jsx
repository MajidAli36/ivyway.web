"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/app/lib/api/client";
import Button from "@/app/components/ui/Button";
import { LockClosedIcon } from "@heroicons/react/24/solid";

export default function TwoFAPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await apiClient.post("/2fa/validate", { token: code });
      if (response.success || response.message === "2FA code valid") {
        // 2FA validated, redirect to correct dashboard based on user role
        const user =
          typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user"))
            : null;
        let redirectPath = "/";
        if (user) {
          switch (user.role) {
            case "student":
              redirectPath = "/student";
              break;
            case "tutor":
              redirectPath = "/tutor";
              break;
            case "counselor":
              redirectPath = "/counselor";
              break;
            case "admin":
              redirectPath = "/admin";
              break;
            default:
              redirectPath = "/";
          }
        }
        router.replace(redirectPath);
      } else {
        setError(response.message || "Invalid or expired code.");
      }
    } catch (err) {
      setError(err.message || "Invalid or expired code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="bg-white/95 rounded-2xl shadow-2xl max-w-md w-full p-8 sm:p-10 border border-blue-100 flex flex-col items-center animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          <span className="bg-blue-100 p-3 rounded-full mb-3">
            <LockClosedIcon className="h-8 w-8 text-blue-600" />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 text-center">
            Two-Factor Authentication
          </h1>
          <p className="text-gray-500 text-center text-base max-w-xs">
            Enter the 6-digit code from your authenticator app to continue.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            minLength={6}
            required
            className="w-full border border-blue-200 rounded-lg px-4 py-3 text-xl tracking-widest text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-blue-50 placeholder:text-blue-300"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            disabled={loading}
            autoFocus
          />
          {error && (
            <div className="text-red-600 text-sm text-center font-medium animate-shake">
              {error}
            </div>
          )}
          <Button
            type="submit"
            className="w-full text-lg py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all shadow-md font-semibold"
            disabled={loading || code.length !== 6}
            isLoading={loading}
          >
            Verify & Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
