"use client";
import { useState, useEffect } from "react";
import { XMarkIcon, CreditCardIcon } from "@heroicons/react/24/outline";
import { apiPut } from "../../utils/api";
import toast from "react-hot-toast";

export default function EditPaymentMethodModal({ 
  isOpen, 
  onClose, 
  paymentMethod, 
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    cardholderName: paymentMethod?.cardholderName || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Update form data when payment method changes
  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        cardholderName: paymentMethod.cardholderName || "",
      });
    }
  }, [paymentMethod]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Update payment method metadata
      const response = await apiPut(`payment-methods/${paymentMethod.id}`, {
        cardholderName: formData.cardholderName.trim(),
      });

      if (response.success) {
        toast.success("Payment method updated successfully!");
        onSuccess(paymentMethod.id, { 
          cardholderName: formData.cardholderName.trim() 
        });
        onClose();
      } else {
        const errorMessage = response.message || "Failed to update payment method";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Error updating payment method:", err);
      const errorMessage = err.message || "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !paymentMethod) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <CreditCardIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Payment Method
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Payment Method Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-14 bg-blue-50 rounded-lg flex items-center justify-center">
                <span className="text-xl">💳</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {paymentMethod.brand || "Card"} ending in {paymentMethod.lastFour || "****"}
                </p>
                <p className="text-xs text-gray-500">
                  Expires {paymentMethod.expiryDate || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardholderName"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.cardholderName ? "border-red-300" : "border-gray-300"
              }`}
              placeholder="Enter cardholder name"
              disabled={isSubmitting}
            />
            {errors.cardholderName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Note about card details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> For security reasons, card numbers and expiry dates cannot be modified. 
              If you need to update these details, please add a new payment method instead.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                "Update Payment Method"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
