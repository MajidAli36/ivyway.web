export default function PaymentForm({
  amount,
  duration,
  selectedMethod,
  onSelectMethod,
}) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Payment</h3>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-base font-medium text-gray-900 mb-4">
          Session Summary
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">
              Tutoring fee ({duration} minutes)
            </span>
            <span className="font-medium">${amount}.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Platform fee</span>
            <span className="font-medium">${(amount * 0.05).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="flex justify-between">
            <span className="text-gray-800 font-medium">Total</span>
            <span className="text-lg font-bold">
              ${(amount * 1.05).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h4 className="text-base font-medium text-gray-900 mb-3">
          Payment Method
        </h4>
        <div className="space-y-3">
          <div
            onClick={() => onSelectMethod("credit-card")}
            className={`flex items-center border p-4 rounded-lg cursor-pointer ${
              selectedMethod === "credit-card"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              id="credit-card"
              checked={selectedMethod === "credit-card"}
              onChange={() => onSelectMethod("credit-card")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="credit-card"
              className="ml-3 flex items-center cursor-pointer"
            >
              <span className="text-gray-900 font-medium">Credit Card</span>
              <div className="ml-auto flex space-x-2">
                <div className="h-8 w-12 bg-blue-100 rounded flex items-center justify-center text-blue-800 text-xs font-bold">
                  VISA
                </div>
                <div className="h-8 w-12 bg-red-100 rounded flex items-center justify-center text-red-800 text-xs font-bold">
                  MC
                </div>
                <div className="h-8 w-12 bg-gray-100 rounded flex items-center justify-center text-gray-800 text-xs font-bold">
                  AMEX
                </div>
              </div>
            </label>
          </div>

          <div
            onClick={() => onSelectMethod("paypal")}
            className={`flex items-center border p-4 rounded-lg cursor-pointer ${
              selectedMethod === "paypal"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              id="paypal"
              checked={selectedMethod === "paypal"}
              onChange={() => onSelectMethod("paypal")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="paypal"
              className="ml-3 flex items-center cursor-pointer"
            >
              <span className="text-gray-900 font-medium">PayPal</span>
              <div className="ml-auto">
                <div className="h-8 w-20 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">
                  PayPal
                </div>
              </div>
            </label>
          </div>

          <div
            onClick={() => onSelectMethod("account-balance")}
            className={`flex items-center border p-4 rounded-lg cursor-pointer ${
              selectedMethod === "account-balance"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              id="account-balance"
              checked={selectedMethod === "account-balance"}
              onChange={() => onSelectMethod("account-balance")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="account-balance"
              className="ml-3 flex items-center cursor-pointer"
            >
              <span className="text-gray-900 font-medium">Account Balance</span>
              <div className="ml-auto">
                <span className="text-green-600 font-medium">
                  $100.00 available
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Your payment will be processed securely. You won't be charged until the
        session is confirmed.
      </div>
    </div>
  );
}
