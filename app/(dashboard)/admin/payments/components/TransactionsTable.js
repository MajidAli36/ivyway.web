"use client";

import { useState, Fragment } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function TransactionsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [itemsPerPage] = useState(5);
  const [modalType, setModalType] = useState(null);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock transaction data
  const transactions = [
    {
      id: "TRX-8742",
      date: "2025-04-12",
      user: "Emma Wilson",
      email: "emma.w@example.com",
      amount: 199.99,
      status: "completed",
      type: "subscription",
      method: "Visa ****4231",
    },
    {
      id: "TRX-8741",
      date: "2025-04-11",
      user: "James Roberts",
      email: "j.roberts@example.com",
      amount: 49.99,
      status: "completed",
      type: "one-time",
      method: "PayPal",
    },
    {
      id: "TRX-8740",
      date: "2025-04-10",
      user: "Sophia Chen",
      email: "sophia.c@example.com",
      amount: 149.99,
      status: "completed",
      type: "subscription",
      method: "Mastercard ****8873",
    },
    {
      id: "TRX-8739",
      date: "2025-04-10",
      user: "Daniel Johnson",
      email: "d.johnson@example.com",
      amount: 99.99,
      status: "pending",
      type: "one-time",
      method: "Bank Transfer",
    },
    {
      id: "TRX-8738",
      date: "2025-04-09",
      user: "Olivia Brown",
      email: "o.brown@example.com",
      amount: 199.99,
      status: "completed",
      type: "subscription",
      method: "Apple Pay",
    },
    {
      id: "TRX-8737",
      date: "2025-04-08",
      user: "William Davis",
      email: "w.davis@example.com",
      amount: 149.99,
      status: "failed",
      type: "subscription",
      method: "Visa ****6589",
    },
    {
      id: "TRX-8736",
      date: "2025-04-07",
      user: "Ava Martinez",
      email: "a.martinez@example.com",
      amount: 25.0,
      status: "refunded",
      type: "one-time",
      method: "Mastercard ****1122",
    },
    {
      id: "TRX-8735",
      date: "2025-04-06",
      user: "Noah Thompson",
      email: "n.thompson@example.com",
      amount: 149.99,
      status: "completed",
      type: "subscription",
      method: "Google Pay",
    },
    {
      id: "TRX-8734",
      date: "2025-04-05",
      user: "Isabella Garcia",
      email: "i.garcia@example.com",
      amount: 75.0,
      status: "pending",
      type: "one-time",
      method: "Visa ****3377",
    },
    {
      id: "TRX-8733",
      date: "2025-04-04",
      user: "Mason Miller",
      email: "m.miller@example.com",
      amount: 199.99,
      status: "completed",
      type: "subscription",
      method: "Mastercard ****9102",
    },
    {
      id: "TRX-8732",
      date: "2025-04-03",
      user: "Charlotte Davis",
      email: "c.davis@example.com",
      amount: 49.99,
      status: "failed",
      type: "one-time",
      method: "PayPal",
    },
    {
      id: "TRX-8731",
      date: "2025-04-02",
      user: "Elijah Rodriguez",
      email: "e.rodriguez@example.com",
      amount: 149.99,
      status: "completed",
      type: "subscription",
      method: "Visa ****5544",
    },
  ];

  // Sorting function
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Get sorted transactions
  const getSortedTransactions = () => {
    return [...transactions].sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle different types
      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedTransactions = getSortedTransactions();

  // Pagination logic
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Handle page change
  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  // Action handlers
  const handleViewTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setModalType("view");
  };

  const handleRefundTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setModalType("refund");
  };

  const handleProcessTransaction = (transaction) => {
    setCurrentTransaction(transaction);
    setModalType("process");
  };

  const handleCloseModal = () => {
    setModalType(null);
    setCurrentTransaction(null);
    setIsProcessing(false);
  };

  const handleConfirmAction = async () => {
    if (!currentTransaction) return;

    setIsProcessing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update transaction status based on action
    const updatedTransactions = transactions.map((t) => {
      if (t.id === currentTransaction.id) {
        if (modalType === "refund") {
          return { ...t, status: "refunded" };
        } else if (modalType === "process") {
          return { ...t, status: "completed" };
        }
      }
      return t;
    });

    // In a real app, you'd update the state with the updated transactions
    // For this example, we'll just close the modal
    setIsProcessing(false);
    handleCloseModal();
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) {
      return (
        <ChevronUpIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />
      );
    }
    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-blue-600" />
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Show at most 5 page buttons

    if (totalPages <= maxPageButtons) {
      // If we have 5 or fewer pages, show all page numbers
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Current page and neighbors
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add page numbers around current page
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("id")}
              >
                <div className="flex items-center">
                  Transaction ID
                  <SortIcon column="id" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon column="date" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("user")}
              >
                <div className="flex items-center">
                  User
                  <SortIcon column="user" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  <SortIcon column="amount" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon column="status" />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {transaction.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-medium text-sm">
                      {transaction.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.user}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusBadgeClass(
                      transaction.status
                    )}`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-3">
                    <button
                      className="text-blue-600 hover:text-blue-900 font-medium"
                      onClick={() => handleViewTransaction(transaction)}
                    >
                      View
                    </button>
                    {transaction.status === "completed" && (
                      <button
                        className="text-red-600 hover:text-red-900 font-medium"
                        onClick={() => handleRefundTransaction(transaction)}
                      >
                        Refund
                      </button>
                    )}
                    {transaction.status === "pending" && (
                      <button
                        className="text-blue-600 hover:text-blue-900 font-medium"
                        onClick={() => handleProcessTransaction(transaction)}
                      >
                        Process
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {/* Empty state if no transactions */}
            {currentTransactions.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, sortedTransactions.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium">{sortedTransactions.length}</span>{" "}
              transactions
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((pageNumber, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof pageNumber === "number" ? paginate(pageNumber) : null
                  }
                  disabled={typeof pageNumber !== "number"}
                  className={`${
                    pageNumber === currentPage
                      ? "bg-blue-50 border-blue-500 text-blue-600"
                      : pageNumber === "..."
                      ? "bg-white border-gray-300 text-gray-700"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                >
                  {pageNumber}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* View Transaction Modal */}
      <Transition appear show={modalType === "view"} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DocumentTextIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Transaction Details
                    </Dialog.Title>
                    <div className="mt-4 space-y-4">
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Transaction ID:
                          </span>
                          <span className="text-sm text-gray-900">
                            {currentTransaction?.id}
                          </span>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Date:
                          </span>
                          <span className="text-sm text-gray-900">
                            {currentTransaction &&
                              new Date(
                                currentTransaction.date
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                          </span>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            User:
                          </span>
                          <span className="text-sm text-gray-900">
                            {currentTransaction?.user}
                          </span>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Email:
                          </span>
                          <span className="text-sm text-gray-900">
                            {currentTransaction?.email}
                          </span>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Amount:
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${currentTransaction?.amount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Status:
                          </span>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                              currentTransaction?.status
                            )}`}
                          >
                            {currentTransaction?.status
                              .charAt(0)
                              .toUpperCase() +
                              currentTransaction?.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Payment Type:
                          </span>
                          <span className="text-sm text-gray-900">
                            {currentTransaction?.type.charAt(0).toUpperCase() +
                              currentTransaction?.type.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="pb-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-500">
                            Payment Method:
                          </span>
                          <span className="text-sm text-gray-900">
                            {currentTransaction?.method}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Refund Transaction Modal */}
      <Transition appear show={modalType === "refund"} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon
                      className="h-6 w-6 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Refund Transaction
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to refund {currentTransaction?.id}{" "}
                        for ${currentTransaction?.amount.toFixed(2)}? This
                        action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleConfirmAction}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Processing...
                      </>
                    ) : (
                      "Refund"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={handleCloseModal}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Process Transaction Modal */}
      <Transition appear show={modalType === "process"} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={handleCloseModal}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <DocumentTextIcon
                      className="h-6 w-6 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Process Transaction
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Do you want to process pending transaction{" "}
                        {currentTransaction?.id} for $
                        {currentTransaction?.amount.toFixed(2)}?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleConfirmAction}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Processing...
                      </>
                    ) : (
                      "Process"
                    )}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={handleCloseModal}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
