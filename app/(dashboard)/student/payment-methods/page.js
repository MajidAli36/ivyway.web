"use client";
import { useEffect, useState } from "react";
import {
  PlusCircleIcon,
  CreditCardIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { apiGet } from "../utils/api";
import AddPaymentMethodModal from "../billing/components/AddPaymentMethodModal";
import PaymentMethodItem from "../billing/components/PaymentMethodItem";
import toast from "react-hot-toast";

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet("payment-methods");
      const methods = res.data || res.methods || [];

      // Sort methods: default first, then by creation date
      const sortedMethods = methods.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setPaymentMethods(sortedMethods);
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      setError(err.message || "Failed to load payment methods");
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newPaymentMethod) => {
    // Add the new payment method to the list
    setPaymentMethods((prev) => {
      const updated = [...prev];

      // If this is set as default, remove default from others
      if (newPaymentMethod.setAsDefault) {
        updated.forEach((method) => (method.isDefault = false));
      }

      // Add the new method at the beginning
      updated.unshift(newPaymentMethod);

      return updated;
    });

    toast.success("Payment method added successfully!");
  };

  const handleUpdate = (id, updates) => {
    setPaymentMethods((prev) =>
      prev.map((method) => {
        if (method.id === id) {
          return { ...method, ...updates };
        }
        // If setting a new default, remove default from others
        if (updates.isDefault) {
          return { ...method, isDefault: false };
        }
        return method;
      })
    );
  };

  const handleRemove = (id) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentMethods();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading payment methods...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#243b53]">Payment Methods</h1>
        <p className="text-[#4b5563] mt-1">
          Manage your saved payment methods for quick and secure transactions
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#243b53]">
                Your Payment Methods
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {paymentMethods.length} payment method
                {paymentMethods.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {refreshing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                    Refreshing...
                  </div>
                ) : (
                  "Refresh"
                )}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        <div className="px-6 py-5">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 text-red-500 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Error Loading Payment Methods
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCardIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No payment methods yet
              </h3>
              <p className="text-gray-500 mb-6">
                Add a payment method to make quick and secure purchases
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Add Your First Payment Method
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <PaymentMethodItem
                  key={method.id}
                  paymentMethod={method}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                  isDefault={method.isDefault}
                  canSetDefault={!method.isDefault}
                />
              ))}
            </div>
          )}

          {/* Security Information */}
          <div className="mt-8 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start">
              <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-[#334e68]">
                  Payment Security
                </h3>
                <p className="text-xs text-[#6b7280] mt-1">
                  Your payment information is encrypted and securely stored
                  using industry-standard security protocols. We never store
                  your full card details on our servers. All transactions are
                  processed securely through Stripe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        onError={() => {}} // Handle errors silently in this context
      />
    </div>
  );
}
