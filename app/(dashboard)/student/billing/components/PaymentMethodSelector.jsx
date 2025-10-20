"use client";
import { useState, useEffect } from "react";
import { CreditCardIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { apiGet } from "../../utils/api";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
import toast from "react-hot-toast";

export default function PaymentMethodSelector({
  selectedPaymentMethodId,
  onPaymentMethodChange,
  showAddNew = true,
  disabled = false,
  className = "",
  label = "Payment Method"
}) {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [stripeError, setStripeError] = useState(false);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const res = await apiGet("payment-methods");
      const methods = res.data || res.methods || [];
      
      // Sort methods: default first, then by creation date
      const sortedMethods = methods.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
      
      setPaymentMethods(sortedMethods);
      
      // Auto-select default payment method if none selected
      if (!selectedPaymentMethodId && sortedMethods.length > 0) {
        const defaultMethod = sortedMethods.find(m => m.isDefault);
        if (defaultMethod) {
          onPaymentMethodChange(defaultMethod.id);
        }
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuccess = (newPaymentMethod) => {
    // Add the new payment method to the list
    setPaymentMethods(prev => {
      const updated = [...prev];
      
      // If this is set as default, remove default from others
      if (newPaymentMethod.setAsDefault) {
        updated.forEach(method => method.isDefault = false);
      }
      
      // Add the new method at the beginning
      updated.unshift(newPaymentMethod);
      
      return updated;
    });
    
    // Select the new payment method
    onPaymentMethodChange(newPaymentMethod.id);
    setShowAddModal(false);
    
    toast.success("Payment method added successfully!");
  };

  const handleAddError = (error) => {
    if (error.includes("Stripe") || error.includes("payment system")) {
      setStripeError(true);
    }
  };

  const formatPaymentMethod = (method) => {
    return `${method.brand} ending in ${method.lastFour}${method.isDefault ? " (Default)" : ""}`;
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${className}`}>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="text-sm text-gray-500">Loading payment methods...</div>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {paymentMethods.length === 0 ? (
        <div className="text-center py-4 border border-gray-300 rounded-lg bg-gray-50">
          <CreditCardIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-3">No payment methods available</p>
                     {showAddNew && (
             <button
               type="button"
               onClick={() => setShowAddModal(true)}
               className="inline-flex items-center px-3 py-1.5 text-sm border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
             >
               <PlusCircleIcon className="h-4 w-4 mr-1" />
               Add Payment Method
             </button>
           )}
           
           {stripeError && (
             <p className="text-xs text-yellow-600 mt-2">
               ⚠️ Payment system is currently unavailable
             </p>
           )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Payment Method Dropdown */}
          <select
            value={selectedPaymentMethodId || ""}
            onChange={(e) => onPaymentMethodChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select a payment method</option>
            {paymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {formatPaymentMethod(method)}
              </option>
            ))}
          </select>
          
          {/* Add New Payment Method Button */}
          {showAddNew && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              disabled={disabled}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              <PlusCircleIcon className="h-4 w-4 mr-1" />
              Add another payment method
            </button>
          )}
        </div>
      )}

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        onError={handleAddError}
      />
    </div>
  );
}
