"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import API from "../../../../lib/api/apiService";

export default function CounselorPayoutRequestModal({ isOpen, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBalance();
    }
  }, [isOpen]);

  const fetchBalance = async () => {
    try {
      const response = await API.getCounselorEarningsBalance();
      setAvailableBalance(response.data.balance || 0);
    } catch (err) {
      console.error("Error fetching counselor balance:", err);
      setError("Failed to fetch available balance");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(amount) > availableBalance) {
      setError("Amount cannot exceed available balance");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await API.requestCounselorPayout({
        amount: parseFloat(amount),
        type: "instant", // or "weekly" based on user preference
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess(false);
        setAmount("");
      }, 2000);
    } catch (err) {
      setError(API.handleError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };

  const setMaxAmount = () => {
    setAmount(availableBalance.toString());
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Request Payout
              </h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Payout Requested Successfully!
                </h3>
                <p className="text-sm text-gray-500">
                  Your payout request has been submitted and is under review.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Available Balance */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Available Balance:
                    </span>
                    <span className="text-lg font-semibold text-blue-600">
                      ${availableBalance.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Payout Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center">
                      <button
                        type="button"
                        onClick={setMaxAmount}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Max
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="mt-2 flex items-center text-sm text-red-600">
                      <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                      {error}
                    </div>
                  )}
                </div>

                {/* Payout Type */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payout Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payoutType"
                        value="instant"
                        defaultChecked
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Instant Payout (Processed within 24 hours)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payoutType"
                        value="weekly"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Weekly Payout (Processed every Monday)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Terms */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    By requesting a payout, you agree to our payout terms.
                    Payouts are typically processed within 1-3 business days
                    after approval. A minimum balance of $10 is required for
                    payout requests.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !amount || parseFloat(amount) <= 0}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Requesting..." : "Request Payout"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
