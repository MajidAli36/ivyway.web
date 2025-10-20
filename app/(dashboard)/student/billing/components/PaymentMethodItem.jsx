"use client";
import { useState } from "react";
import { 
  CreditCardIcon, 
  TrashIcon, 
  PencilIcon,
  CheckIcon,
  ExclamationTriangleIcon 
} from "@heroicons/react/24/outline";
import { apiPut, apiDelete } from "../../utils/api";
import toast from "react-hot-toast";
import EditPaymentMethodModal from "./EditPaymentMethodModal";

// Card brand icons and colors
const CARD_BRANDS = {
  visa: { icon: "💳", color: "text-blue-700", bgColor: "bg-blue-50" },
  mastercard: { icon: "💳", color: "text-red-600", bgColor: "bg-red-50" },
  amex: { icon: "💳", color: "text-green-600", bgColor: "bg-green-50" },
  discover: { icon: "💳", color: "text-orange-600", bgColor: "bg-orange-50" },
  jcb: { icon: "💳", color: "text-purple-600", bgColor: "bg-purple-50" },
  dinersclub: { icon: "💳", color: "text-gray-600", bgColor: "bg-gray-50" },
  unionpay: { icon: "💳", color: "text-indigo-600", bgColor: "bg-indigo-50" },
};

export default function PaymentMethodItem({ 
  paymentMethod, 
  onUpdate, 
  onRemove,
  isDefault,
  canSetDefault = true 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmDefault, setShowConfirmDefault] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const brand = paymentMethod.brand?.toLowerCase() || "unknown";
  const brandConfig = CARD_BRANDS[brand] || CARD_BRANDS.visa;

  const handleSetDefault = async () => {
    if (!canSetDefault) return;
    
    setIsLoading(true);
    try {
      const response = await apiPut(`payment-methods/${paymentMethod.id}/default`, {});
      
      if (response.success) {
        toast.success("Default payment method updated!");
        onUpdate(paymentMethod.id, { isDefault: true });
      } else {
        toast.error(response.message || "Failed to set default payment method");
      }
    } catch (err) {
      console.error("Error setting default payment method:", err);
      toast.error("Failed to set default payment method");
    } finally {
      setIsLoading(false);
      setShowConfirmDefault(false);
    }
  };

  const handleRemove = async () => {
    if (isDefault) {
      toast.error("Cannot remove default payment method");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiDelete(`payment-methods/${paymentMethod.id}`);
      
      if (response.success) {
        toast.success("Payment method removed successfully!");
        onRemove(paymentMethod.id);
      } else {
        toast.error(response.message || "Failed to remove payment method");
      }
    } catch (err) {
      console.error("Error removing payment method:", err);
      toast.error("Failed to remove payment method");
    } finally {
      setIsLoading(false);
      setShowConfirmDelete(false);
    }
  };

  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) return "N/A";
    
    // Handle different expiry date formats
    if (typeof expiryDate === "string") {
      // If it's already formatted, return as is
      if (expiryDate.includes("/")) return expiryDate;
      
      // If it's a date string, format it
      try {
        const date = new Date(expiryDate);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString("en-US", { 
            month: "2-digit", 
            year: "2-digit" 
          });
        }
      } catch (e) {
        // If parsing fails, return as is
      }
    }
    
    return expiryDate;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
      {/* Main Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Card Brand Icon */}
          <div className={`flex-shrink-0 h-12 w-16 ${brandConfig.bgColor} rounded-lg flex items-center justify-center`}>
            <span className="text-2xl">{brandConfig.icon}</span>
          </div>
          
          {/* Card Details */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-medium text-gray-900 capitalize">
                {paymentMethod.brand || "Card"} ending in {paymentMethod.lastFour || "****"}
              </h3>
              {isDefault && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <CheckIcon className="h-3 w-3 mr-1" />
                  Default
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
              <span>Expires {formatExpiryDate(paymentMethod.expiryDate)}</span>
              {paymentMethod.cardholderName && (
                <span>• {paymentMethod.cardholderName}</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {!isDefault && canSetDefault && (
            <button
              onClick={() => setShowConfirmDefault(true)}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Set as Default
            </button>
          )}
          
          <button
            onClick={() => setShowEditModal(true)}
            disabled={isLoading}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            title="Edit payment method"
          >
            <PencilIcon className="h-4 w-4" />
          </button>
          
          {!isDefault && (
            <button
              onClick={() => setShowConfirmDelete(true)}
              disabled={isLoading}
              className="p-2 text-red-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Remove payment method"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="mt-3 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-500">Processing...</span>
        </div>
      )}

      {/* Confirmation Modals */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center mb-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Remove Payment Method</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove this payment method? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDefault && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center mb-4">
              <CheckIcon className="h-6 w-6 text-blue-500 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">Set as Default</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              This payment method will be used as the default for future transactions.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDefault(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSetDefault}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Set as Default
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Payment Method Modal */}
      <EditPaymentMethodModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        paymentMethod={paymentMethod}
        onSuccess={onUpdate}
      />
    </div>
  );
}
