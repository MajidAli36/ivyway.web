"use client";
import { useState, useEffect } from "react";
import { XMarkIcon, CreditCardIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiPost } from "../../utils/api";
import toast from "react-hot-toast";
import PaymentStripeProvider from "@/app/providers/PaymentStripeProvider";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#424770",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  },
};

// Inner component that uses Stripe hooks
function AddPaymentMethodModalContent({ 
  isOpen, 
  onClose, 
  onSuccess, 
  setAsDefault = false 
}) {
  const stripe = useStripe();
  const elements = useElements();
  
  // Check if Stripe is available
  const isStripeAvailable = stripe && elements;
  
  const [formData, setFormData] = useState({
    cardholderName: "",
    setAsDefault: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isStripeAvailable) {
      newErrors.general = "Payment system is not ready. Please contact support.";
    }
    
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
      // Create payment method with Stripe
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
        billing_details: {
          name: formData.cardholderName.trim(),
        },
      });

      if (error) {
        setErrors({ general: error.message });
        toast.error(error.message);
        return;
      }

      // Save payment method to backend
      const response = await apiPost("payment-methods", {
        paymentMethodId: paymentMethod.id,
        cardholderName: formData.cardholderName.trim(),
        setAsDefault: formData.setAsDefault,
      });

      if (response.success) {
        toast.success("Payment method added successfully!");
        onSuccess(response.data);
        onClose();
      } else {
        const errorMessage = response.message || "Failed to save payment method";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
        if (onError) onError(errorMessage);
      }
    } catch (err) {
      console.error("Error adding payment method:", err);
      const errorMessage = err.message || "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <CreditCardIcon className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Add Payment Method
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

                     {/* Card Details */}
           {isStripeAvailable ? (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Card Details
               </label>
               <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                 <CardElement options={CARD_ELEMENT_OPTIONS} />
               </div>
               <p className="mt-2 text-xs text-gray-500">
                 Your card information is encrypted and secure
               </p>
             </div>
           ) : (
             <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
               <p className="text-sm text-yellow-700">
                 Payment system is currently unavailable. Please contact support to add payment methods.
               </p>
             </div>
           )}

          {/* Set as Default */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="setAsDefault"
              name="setAsDefault"
              checked={formData.setAsDefault}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isSubmitting}
            />
            <label htmlFor="setAsDefault" className="ml-2 block text-sm text-gray-700">
              Set as default payment method
            </label>
          </div>

          {/* General Errors */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
                         <button
               type="submit"
               className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               disabled={isSubmitting || !isStripeAvailable}
             >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </div>
              ) : (
                "Add Payment Method"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddPaymentMethodModal({ isOpen, onClose, onSuccess, onError }) {
  return (
    <PaymentStripeProvider>
      <AddPaymentMethodModalContent
        isOpen={isOpen}
        onClose={onClose}
        onSuccess={onSuccess}
        onError={onError}
      />
    </PaymentStripeProvider>
  );
}
