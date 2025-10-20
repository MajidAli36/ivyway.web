// app/providers/AuthProviderWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import AuthProvider from "./AuthProvider";

const isProtectedPath = (path) => {
  // Include all role dashboards to ensure auth loading spinner is shown until user is resolved
  return /^(?:\/)(student|tutor|counselor|teacher|admin)(?:\b|\/)/.test(path || "");
};

export default function AuthProviderWrapper({ children }) {
  const pathname = usePathname();

  const showLoading = isProtectedPath(pathname);

  return <AuthProvider showLoading={showLoading}>{children}</AuthProvider>;
}
