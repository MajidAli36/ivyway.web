"use client";
import { useState, useEffect } from "react";
import { XMarkIcon, CreditCardIcon, CheckIcon } from "@heroicons/react/24/outline";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { apiGet, apiPost } from "../../utils/api";
import AddPaymentMethodModal from "./AddPaymentMethodModal";
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
function PlanPurchaseModalContent({ 
  isOpen, 
  onClose, 
  plan, 
  onSuccess 
}) {
  const stripe = useStripe();
  const elements = useElements();
  
  // Check if Stripe is available
  const isStripeAvailable = stripe && elements;
  
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("saved");
  const [savedPaymentMethodId, setSavedPaymentMethodId] = useState("");
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
    }
  }, [isOpen]);

  const fetchPaymentMethods = async () => {
    try {
      setLoadingPaymentMethods(true);
      const res = await apiGet("payment-methods");
      const methods = res.data || res.methods || [];
      
      // Sort methods: default first, then by creation date
      const sortedMethods = methods.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
      
      setPaymentMethods(sortedMethods);
      
      // Set default payment method if available
      const defaultMethod = sortedMethods.find(m => m.isDefault);
      if (defaultMethod) {
        setSavedPaymentMethodId(defaultMethod.id);
      }
    } catch (err) {
      console.error("Error fetching payment methods:", err);
      toast.error("Failed to load payment methods");
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const handlePaymentMethodSuccess = (newPaymentMethod) => {
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
    setSelectedPaymentMethod("saved");
    setSavedPaymentMethodId(newPaymentMethod.id);
    setShowAddPaymentModal(false);
    
    toast.success("Payment method added successfully!");
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!isStripeAvailable) {
      newErrors.general = "Payment system is not ready. Please contact support.";
    }
    
    if (selectedPaymentMethod === "saved" && !savedPaymentMethodId) {
      newErrors.paymentMethod = "Please select a payment method";
    }
    
    if (selectedPaymentMethod === "new" && !isStripeAvailable) {
      newErrors.general = "Cannot add new payment methods. Payment system is not available.";
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
      let paymentMethodId = savedPaymentMethodId;
      
      // If using a new payment method, create it first
      if (selectedPaymentMethod === "new") {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardElement),
        });

        if (error) {
          setErrors({ general: error.message });
          toast.error(error.message);
          return;
        }
        
        paymentMethodId = paymentMethod.id;
      }

      // Purchase the plan
      const response = await apiPost("plans/purchase", {
        planId: plan.id,
        paymentMethodId: paymentMethodId,
        amount: plan.price,
        currency: "usd", // Assuming USD, could be made dynamic
      });

      if (response.success) {
        toast.success("Plan purchased successfully!");
        onSuccess(response.data);
        onClose();
      } else {
        setErrors({ general: response.message || "Failed to purchase plan" });
        toast.error(response.message || "Failed to purchase plan");
      }
    } catch (err) {
      console.error("Error purchasing plan:", err);
      const errorMessage = err.message || "An unexpected error occurred";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Purchase Plan
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Complete your purchase for {plan.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isSubmitting}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Plan Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-blue-700 mb-2">{plan.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-900">
                  ${typeof plan.price === "number" ? plan.price.toFixed(2) : plan.price}
                </div>
                <div className="text-sm text-blue-600">
                  {plan.sessionCount} sessions
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              
              {/* Saved Payment Methods */}
              {paymentMethods.length > 0 && (
                <div className="space-y-3 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="saved"
                      checked={selectedPaymentMethod === "saved"}
                      onChange={() => setSelectedPaymentMethod("saved")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Use saved payment method
                    </span>
                  </label>
                  
                  {selectedPaymentMethod === "saved" && (
                    <div className="ml-6">
                      {loadingPaymentMethods ? (
                        <div className="text-sm text-gray-500">Loading payment methods...</div>
                      ) : (
                        <select
                          value={savedPaymentMethodId}
                          onChange={(e) => setSavedPaymentMethodId(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={isSubmitting}
                        >
                          <option value="">Select a payment method</option>
                          {paymentMethods.map((method) => (
                            <option key={method.id} value={method.id}>
                              {method.brand} ending in {method.lastFour}
                              {method.isDefault ? " (Default)" : ""}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}
                </div>
              )}

                             {/* New Payment Method */}
               <div className="space-y-3">
                 <label className="flex items-center">
                   <input
                     type="radio"
                     name="paymentMethod"
                     value="new"
                     checked={selectedPaymentMethod === "new"}
                     onChange={() => setSelectedPaymentMethod("new")}
                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                     disabled={isSubmitting || !isStripeAvailable}
                   />
                   <span className="ml-2 text-sm font-medium text-gray-700">
                     Add new payment method
                     {!isStripeAvailable && " (Unavailable)"}
                   </span>
                 </label>
                 
                 {selectedPaymentMethod === "new" && isStripeAvailable && (
                   <div className="ml-6 space-y-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">
                         Card Details
                       </label>
                       <div className="border border-gray-300 rounded-lg p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                         <CardElement options={CARD_ELEMENT_OPTIONS} />
                       </div>
                     </div>
                     
                     <div className="flex items-center">
                       <input
                         type="checkbox"
                         id="saveForFuture"
                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                         disabled={isSubmitting}
                       />
                       <label htmlFor="saveForFuture" className="ml-2 block text-sm text-gray-700">
                         Save this payment method for future use
                       </label>
                     </div>
                   </div>
                 )}
                 
                 {selectedPaymentMethod === "new" && !isStripeAvailable && (
                   <div className="ml-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                     <p className="text-sm text-yellow-700">
                       Adding new payment methods is currently unavailable. Please use an existing payment method or contact support.
                     </p>
                   </div>
                 )}
               </div>

              {/* Add Payment Method Button */}
              {paymentMethods.length > 0 && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setShowAddPaymentModal(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    disabled={isSubmitting}
                  >
                    + Add another payment method
                  </button>
                </div>
              )}
            </div>

            {/* Errors */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}
            {errors.paymentMethod && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.paymentMethod}</p>
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
                    Processing...
                  </div>
                ) : (
                  `Purchase for $${typeof plan.price === "number" ? plan.price.toFixed(2) : plan.price}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      <AddPaymentMethodModal
        isOpen={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        onSuccess={handlePaymentMethodSuccess}
        onError={() => {}} // Handle errors silently in this context
      />
    </>
  );
}

export default function PlanPurchaseModal({ 
  isOpen, 
  onClose, 
  plan, 
  onSuccess 
}) {
  return (
    <PaymentStripeProvider>
      <PlanPurchaseModalContent
        isOpen={isOpen}
        onClose={onClose}
        plan={plan}
        onSuccess={onSuccess}
      />
    </PaymentStripeProvider>
  );
}
