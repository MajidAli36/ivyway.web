"use client";

import React, { useState, useEffect } from "react";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import counselorEarningsService from "../../lib/api/counselorEarningsService";

const CounselorPayoutRequestModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  currentBalance = 0 
}) => {
  const [payoutType, setPayoutType] = useState("weekly");
  const [customAmount, setCustomAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validation, setValidation] = useState({ isValid: true, errors: [], warnings: [] });

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess(false);
      setCustomAmount("");
      setPayoutType("weekly");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payoutData = {
      type: payoutType,
      amount: customAmount ? parseInt(customAmount) * 100 : undefined // Convert to cents
    };

    // Validate payout request
    const validationResult = counselorEarningsService.validatePayoutRequest(
      payoutData, 
      currentBalance
    );

    setValidation(validationResult);

    if (!validationResult.isValid) {
      setError(validationResult.errors.join(", "));
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const payout = await counselorEarningsService.requestPayout(payoutData);
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSuccess(false);
        setCustomAmount("");
        setPayoutType("weekly");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      setError("");
    }
  };

  const setMaxAmount = () => {
    setCustomAmount((currentBalance / 100).toString());
    setError("");
  };

  const calculateFees = () => {
    const amount = customAmount ? parseInt(customAmount) * 100 : currentBalance;
    return counselorEarningsService.calculatePayoutFees(payoutType, amount);
  };

  const fees = calculateFees();
  const eligibility = counselorEarningsService.getPayoutEligibility(currentBalance);

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
                      {counselorEarningsService.formatCurrency(currentBalance)}
                    </span>
                  </div>
                  {!eligibility.isEligible && (
                    <div className="mt-2 text-sm text-amber-600">
                      <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                      Minimum payout: {counselorEarningsService.formatCurrency(eligibility.minimumAmount)}
                    </div>
                  )}
                </div>

                {/* Payout Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payout Type
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payoutType"
                        value="weekly"
                        checked={payoutType === "weekly"}
                        onChange={(e) => setPayoutType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Weekly Payout
                        </div>
                        <div className="text-sm text-gray-500">
                          Processed every Monday • No fees
                        </div>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        Free
                      </div>
                    </label>

                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="payoutType"
                        value="instant"
                        checked={payoutType === "instant"}
                        onChange={(e) => setPayoutType(e.target.value)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          Instant Payout
                        </div>
                        <div className="text-sm text-gray-500">
                          Processed within 24 hours
                        </div>
                      </div>
                      <div className="text-sm font-medium text-amber-600">
                        $1.99 fee
                      </div>
                    </label>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payout Amount (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleAmountChange}
                      className="block w-full pl-7 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={(currentBalance / 100).toFixed(2)}
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
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to payout full balance
                  </p>
                </div>

                {/* Fee Calculation */}
                {fees.fee > 0 && (
                  <div className="mb-6 p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <InformationCircleIcon className="h-4 w-4 text-amber-600 mr-2" />
                      <span className="text-sm font-medium text-amber-800">
                        Fee Calculation
                      </span>
                    </div>
                    <div className="text-sm text-amber-700">
                      <div className="flex justify-between">
                        <span>Payout Amount:</span>
                        <span>{counselorEarningsService.formatCurrency(fees.netAmount + fees.fee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Processing Fee:</span>
                        <span>-{counselorEarningsService.formatCurrency(fees.fee)}</span>
                      </div>
                      <div className="flex justify-between font-medium border-t border-amber-200 pt-1 mt-1">
                        <span>You'll Receive:</span>
                        <span>{counselorEarningsService.formatCurrency(fees.netAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Errors */}
                {validation.errors.length > 0 && (
                  <div className="mb-6 p-3 bg-red-50 rounded-lg">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-400 mr-2" />
                      <div className="text-sm text-red-600">
                        {validation.errors.map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Warnings */}
                {validation.warnings.length > 0 && (
                  <div className="mb-6 p-3 bg-yellow-50 rounded-lg">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-4 w-4 text-yellow-400 mr-2" />
                      <div className="text-sm text-yellow-600">
                        {validation.warnings.map((warning, index) => (
                          <div key={index}>{warning}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="mb-6 p-3 bg-red-50 rounded-lg">
                    <div className="flex">
                      <ExclamationTriangleIcon className="h-4 w-4 text-red-400 mr-2" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  </div>
                )}

                {/* Terms */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    By requesting a payout, you agree to our payout terms. 
                    {payoutType === "weekly" 
                      ? " Weekly payouts are processed every Monday and typically arrive within 1-3 business days."
                      : " Instant payouts are processed within 24 hours and typically arrive within 1-2 business days."
                    }
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
                    disabled={isLoading || !eligibility.isEligible}
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
};

export default CounselorPayoutRequestModal;
