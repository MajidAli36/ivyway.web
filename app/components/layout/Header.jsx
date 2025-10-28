"use client";

import { useState, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import Button from "../shared/Button";
import MobileMenu from "./MobileMenu";
import {
  UserCircle,
  ChevronDown,
  LogOut,
  Settings,
  User,
  ArrowLeftIcon,
} from "lucide-react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Header({
  showBackButton = false,
  backButtonText = "Back to Home",
  backButtonHref = "/",
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 pt-2">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Link
                href={backButtonHref}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="text-sm">{backButtonText}</span>
              </Link>
            )}
            <Link href="/">
              <Image
                src="/header1.png"
                alt="IvyWay Logo"
                width={120}
                height={120}
                className="mr-2 w-[120px] h-auto"
                priority
              />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              href="/#features"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#subjects"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Subjects
            </Link>
            <Link
              href="/#testimonials"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/#pricing"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/coming-soon"
              className="text-slate-700 hover:text-blue-600 font-medium transition-colors group relative"
            >
              IvyWay AI
            </Link>
          </nav>

          {/* Conditional rendering based on authentication status */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button 
                  href={`/${user?.role || "student"}`} 
                  variant="primary"
                  className="text-sm px-4 py-2"
                >
                  Go to Dashboard
                </Button>
                <Menu as="div" className="relative ml-3">
                <div>
                  <Menu.Button className="flex items-center max-w-xs rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-gray-50 cursor-pointer p-1 transition-colors">
                    <span className="sr-only">Open user menu</span>
                    {user?.photoURL ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={user.photoURL}
                        alt="User Avatar"
                        width={32}
                        height={32}
                      />
                    ) : (
                      <UserCircle className="h-8 w-8 text-blue-500" />
                    )}
                    <span className="ml-2 text-slate-700 font-medium hidden lg:block">
                      {user?.displayName ||
                        user?.email?.split("@")[0] ||
                        "User"}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-slate-500" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.displayName || "User Profile"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || ""}
                      </p>
                    </div>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href={`/${user?.role || "student"}/profile`}
                          className={classNames(
                            active ? "bg-gray-50" : "",
                            "flex items-center px-4 py-2 text-sm text-gray-700 cursor-pointer"
                          )}
                        >
                          <User className="mr-3 h-4 w-4 text-gray-500" />
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={classNames(
                            active ? "bg-red-50" : "",
                            "flex w-full items-center px-4 py-2 text-sm text-red-600 hover:text-red-700 cursor-pointer"
                          )}
                        >
                          <LogOut className="mr-3 h-4 w-4 text-red-500" />
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
                </Menu>
              </>
            ) : (
              <>
                <Button href="/login" variant="secondary">
                  Log in
                </Button>
                <Button href="/register" variant="primary">
                  Sign up
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <button
              className="text-slate-700 hover:text-blue-600"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
        user={user}
      />
    </header>
  );
}
