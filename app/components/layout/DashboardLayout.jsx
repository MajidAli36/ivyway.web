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
  const pathname = usePathname();
  const { logout } = useAuth();
  const { unreadCount } = useNotificationCount();
  const { markAllAsRead } = useNotifications();
  const { unreadCount: messageCount } = useMessageCount();

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
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
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
                <div className="h-0 flex-1 overflow-y-auto pb-4">
                  <div className="flex flex-shrink-0 items-center px-4 py-5">
                    <div className="text-2xl font-bold text-blue-600">
                      IvyWay
                    </div>
                  </div>
                  <div className="mt-2 space-y-1 px-2">
                    {navigation.map((item) => {
                      const active = isActive(item.href);
                      const isNotificationItem = item.icon === "BellIcon";
                      const isMessageItem = item.icon === "ChatBubbleLeft";

                      return (
                        <Link key={item.name} href={item.href}>
                          <button
                            className={`group flex w-full items-center rounded-md py-2 px-2 text-base font-medium ${
                              active
                                ? "bg-blue-100 text-blue-800"
                                : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
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
                  </div>
                </div>
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        {userRole || "User"}
                      </p>
                      <button
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        onClick={logout}
                      >
                        <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
                        <span>Sign out</span>
                      </button>
                    </div>
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
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Image
                className="h-28 w-auto"
                src="/logo.png"
                alt="IvyWay Logo"
                width={140}
                height={40}
              />
            </div>
            <nav className="mt-8 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                const active = isActive(item.href);
                const isNotificationItem = item.icon === "BellIcon";
                const isMessageItem = item.icon === "ChatBubbleLeft";

                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={`group flex w-full items-center rounded-md py-2 px-2 text-sm font-medium ${
                        active
                          ? "bg-blue-100 text-blue-800"
                          : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
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
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {userRole || "User"}
                  </p>
                  <button
                    className="flex items-center text-sm text-blue-600 hover:text-white hover:bg-blue-600 px-2 py-1 rounded-md transition-colors duration-200 hover:cursor-pointer"
                    onClick={logout}
                  >
                    <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
                    <span>Sign out</span>
                  </button>
                </div>
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

      {/* Support Bot - Exclude for admin users */}
      {/* {userRole !== "Administrator" && <SupportBot userRole={userRole} />} */}
    </div>
  );
}
