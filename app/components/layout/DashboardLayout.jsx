"use client";
import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  XMarkIcon,
  Bars3Icon,
  HomeIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  CreditCardIcon,
  AcademicCapIcon,
  ChatBubbleLeftIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  InboxArrowDownIcon,
  UserCircleIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  QuestionMarkCircleIcon,
  ArrowUpCircleIcon,
  UserPlusIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import { ChartArea, ChartBar, ListCollapse } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useNotificationCount, useNotifications } from "@/app/providers/NotificationProvider";
import { useMessageCount } from "@/app/hooks/useMessageCount";
import { SupportBot } from "../support";
import NotificationBell from "../notifications/NotificationBell";
import React from "react";

// Icon map for string keys
const iconMap = {
  Home: HomeIcon,
  User: UserIcon,
  Calendar: CalendarIcon,
  DocumentText: DocumentTextIcon,
  CreditCard: CreditCardIcon,
  AcademicCap: AcademicCapIcon,
  ChatBubbleLeft: ChatBubbleLeftIcon,
  BellIcon: BellIcon,
  ArrowLeftOnRectangle: ArrowLeftOnRectangleIcon,
  InboxArrowDown: InboxArrowDownIcon,
  UserCircleIcon: UserCircleIcon,
  SparklesIcon: SparklesIcon,
  CurrencyDollarIcon: CurrencyDollarIcon,
  ChartArea: ChartArea,
  ChartBar: ChartBar,
  ListCollapse: ListCollapse,
  QuestionMarkCircle: QuestionMarkCircleIcon,
  ArrowUpCircle: ArrowUpCircleIcon,
  UserPlus: UserPlusIcon,
  ClipboardDocumentList: ClipboardDocumentListIcon,
  UserGroup: UserGroupIcon,
};

export default function DashboardLayout({ children, navigation, userRole }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const { logout } = useAuth();
  const { unreadCount } = useNotificationCount();
  const { markAllAsRead } = useNotifications();
  const { unreadCount: messageCount } = useMessageCount();
  
  const handleLogout = () => {
    setShowLogoutModal(true);
  };
  
  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  // Function to check if a nav item is active
  const isActive = (href) => {
    return href === pathname;
  };

  // Function to handle navigation with special logic for notifications
  const handleNavigation = async (href, item) => {
    // If navigating to notifications, mark all as read
    if (item.icon === "BellIcon" && unreadCount > 0) {
      try {
        await markAllAsRead();
      } catch (error) {
        console.error("Error marking notifications as read:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 md:hidden"
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white h-full">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                {/* Logo - Fixed at top */}
                <div className="flex-shrink-0 flex items-center justify-center px-4 py-2 border-b border-gray-100">
                  <Image
                    className="h-32 w-auto"
                    src="/logo.png"
                    alt="IvyWay Logo"
                    width={160}
                    height={54}
                  />
                </div>
                {/* Navigation - Scrollable middle section */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <nav className="mt-1 space-y-0.5 px-2 pb-4">
                    {navigation.map((item) => {
                      const active = isActive(item.href);
                      const isNotificationItem = item.icon === "BellIcon";
                      const isMessageItem = item.icon === "ChatBubbleLeft";

                      return (
                        <Link key={item.name} href={item.href}>
                          <button
                            className={`group flex w-full items-center rounded-lg py-2.5 px-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-blue-50 text-blue-700 shadow-sm"
                                : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                            }`}
                            onClick={() => {
                              setSidebarOpen(false);
                              handleNavigation(item.href, item);
                            }}
                          >
                            <div
                              className={
                                active
                                  ? "text-blue-700"
                                  : "text-gray-500 group-hover:text-blue-600"
                              }
                            >
                              {item.icon && iconMap[item.icon] && (
                                <span className="h-6 w-6 inline-block align-middle">
                                  {React.createElement(iconMap[item.icon], {
                                    className: "h-6 w-6",
                                  })}
                                </span>
                              )}
                            </div>
                            <span className="ml-3 flex-1 text-left">
                              {item.name}
                            </span>

                            {/* Notification count badge */}
                            {isNotificationItem && unreadCount > 0 && (
                              <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white min-w-[20px] justify-center">
                                {unreadCount > 99 ? "99+" : unreadCount}
                              </span>
                            )}

                            {/* Message count badge */}
                            {isMessageItem && messageCount > 0 && (
                              <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white min-w-[20px] justify-center">
                                {messageCount > 99 ? "99+" : messageCount}
                              </span>
                            )}

                            {/* Active indicator */}
                            {active && (
                              <span
                                className="ml-2 h-1.5 w-1.5 rounded-full bg-blue-600"
                                aria-hidden="true"
                              />
                            )}
                          </button>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
                {/* Footer - Fixed at bottom */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-3">
                  <div className="flex flex-col w-full space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {userRole || "User"}
                    </p>
                    <button
                      className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setSidebarOpen(false);
                        handleLogout();
                      }}
                    >
                      <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                      <span className="font-medium">Sign out</span>
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0"></div>
          </div>
        </Dialog>
      </Transition.Root>
      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col h-full border-r border-gray-200 bg-white">
          {/* Logo - Fixed at top */}
          <div className="flex-shrink-0 flex items-center justify-center px-4 py-2 border-b border-gray-100">
            <Image
              className="h-32 w-auto"
              src="/logo.png"
              alt="IvyWay Logo"
              width={160}
              height={54}
            />
          </div>
          {/* Navigation - Scrollable middle section */}
          <nav className="flex-1 overflow-y-auto mt-2 space-y-0.5 px-2 min-h-0">
            {navigation.map((item) => {
              const active = isActive(item.href);
              const isNotificationItem = item.icon === "BellIcon";
              const isMessageItem = item.icon === "ChatBubbleLeft";

              return (
                <Link key={item.name} href={item.href}>
                  <button
                    className={`group flex w-full items-center rounded-lg py-2.5 px-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                    onClick={() => handleNavigation(item.href, item)}
                  >
                    <div
                      className={
                        active
                          ? "text-blue-700"
                          : "text-gray-500 group-hover:text-blue-600"
                      }
                    >
                      {item.icon && iconMap[item.icon] && (
                        <span className="h-6 w-6 inline-block align-middle">
                          {React.createElement(iconMap[item.icon], {
                            className: "h-6 w-6",
                          })}
                        </span>
                      )}
                    </div>
                    <span className="ml-3 flex-1 text-left">{item.name}</span>

                    {/* Notification count badge */}
                    {isNotificationItem && unreadCount > 0 && (
                      <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white min-w-[20px] justify-center">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}

                    {/* Message count badge */}
                    {isMessageItem && messageCount > 0 && (
                      <span className="ml-auto inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500 text-white min-w-[20px] justify-center">
                        {messageCount > 99 ? "99+" : messageCount}
                      </span>
                    )}

                    {/* Active indicator */}
                    {active && (
                      <span
                        className="ml-2 h-1.5 w-1.5 rounded-full bg-blue-600"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </Link>
              );
            })}
          </nav>
          {/* Footer - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-3">
            <div className="group block w-full">
              <div className="flex flex-col space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {userRole || "User"}
                </p>
                <button
                  className="flex items-center text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                  <span className="font-medium">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="md:pl-64">
        <div className="mx-auto flex max-w-7xl flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden shadow-sm">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-slate-700 hover:text-blue-600"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              <div className="flex items-center space-x-4 pr-4">
                <NotificationBell />
              </div>
            </div>
          </div>

          {/* Notification bar (optional) */}
          <div className="bg-blue-600 text-white py-2 px-4 text-center text-sm">
            <BellIcon className="inline-block h-4 w-4 mr-1" />
            {unreadCount > 0 ? (
              <span>
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </span>
            ) : (
              <span>Welcome to the dashboard! You're all caught up.</span>
            )}
          </div>

          <main className="flex-1 pb-8">
            <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Transition.Root show={showLogoutModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowLogoutModal(false)}
        >
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ArrowLeftOnRectangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Sign out
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to sign out? You'll need to log in again to access your account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto cursor-pointer"
                      onClick={confirmLogout}
                    >
                      Sign out
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto cursor-pointer"
                      onClick={() => setShowLogoutModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
