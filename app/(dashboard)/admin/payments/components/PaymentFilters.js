import { XMarkIcon } from "@heroicons/react/20/solid";

export default function PaymentFilters({ onClose }) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700">Advanced Filters</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="date-range"
            className="block text-sm font-medium text-gray-700"
          >
            Date Range
          </label>
          <select
            id="date-range"
            name="date-range"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue="all"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="payment-type"
            className="block text-sm font-medium text-gray-700"
          >
            Payment Type
          </label>
          <select
            id="payment-type"
            name="payment-type"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue="all"
          >
            <option value="all">All Types</option>
            <option value="subscription">Subscriptions</option>
            <option value="one-time">One-time Payments</option>
            <option value="refund">Refunds</option>
            <option value="payout">Payouts</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="payment-method"
            className="block text-sm font-medium text-gray-700"
          >
            Payment Method
          </label>
          <select
            id="payment-method"
            name="payment-method"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue="all"
          >
            <option value="all">All Methods</option>
            <option value="card">Credit/Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
            <option value="wallet">Digital Wallet</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label
            htmlFor="min-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Min Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="min-amount"
              id="min-amount"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="max-amount"
            className="block text-sm font-medium text-gray-700"
          >
            Max Amount
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              name="max-amount"
              id="max-amount"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="1000.00"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="user-id"
            className="block text-sm font-medium text-gray-700"
          >
            User ID/Email
          </label>
          <input
            type="text"
            name="user-id"
            id="user-id"
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Email or User ID"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          className="mr-2 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Reset
        </button>
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
