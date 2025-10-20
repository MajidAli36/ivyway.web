import Link from "next/link";
import Image from "next/image";
import { UserCircle, LogOut, Settings, User } from "lucide-react";

export default function MobileMenu({
  isOpen,
  isAuthenticated,
  handleLogout,
  user,
}) {
  if (!isOpen) return null;

  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
        <a
          href="#features"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
        >
          Features
        </a>
        <a
          href="#subjects"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
        >
          Subjects
        </a>
        <Link
          href="/testimonials"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
        >
          Testimonials
        </Link>
        <a
          href="#pricing"
          className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
        >
          Pricing
        </a>
        <Link
          href="/coming-soon"
          className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center justify-between px-4 py-2"
        >
          IvyWay AI
        </Link>

        {isAuthenticated ? (
          <>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                {user?.photoURL ? (
                  <div className="flex-shrink-0">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src={user.photoURL}
                      alt="User Avatar"
                      width={40}
                      height={40}
                    />
                  </div>
                ) : (
                  <UserCircle className="h-10 w-10 text-blue-500" />
                )}
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {user?.displayName || "User Profile"}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {user?.email || ""}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href={`/${user?.role || 'student'}/profile`}
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <User className="mr-3 h-5 w-5 text-gray-500" />
                  Your Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <Settings className="mr-3 h-5 w-5 text-gray-500" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                  Sign out
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex flex-col space-y-3 px-3">
              <Link
                href="/login"
                className="block w-full px-4 py-2 text-center font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="block w-full px-4 py-2 text-center font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
