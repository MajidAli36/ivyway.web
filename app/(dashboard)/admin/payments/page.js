"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  FunnelIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";
import {
  BanknotesIcon,
  CreditCardIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import PaymentStats from "./components/PaymentStats";
import RefundRequests from "./components/RefundRequests";
import TutorPayouts from "./components/TutorPayouts";
import TransactionsTable from "./components/TransactionsTable";
import RevenueChart from "./components/RevenueChart";
import PaymentFilters from "./components/PaymentFilters";

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [dateRange, setDateRange] = useState("last30");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Mock data for payment stats
  const paymentStats = [
    {
      name: "Total Revenue",
      value: "$145,280.00",
      change: "+12.5%",
      trend: "up",
      icon: BanknotesIcon,
    },
    {
      name: "Pending Payments",
      value: "$4,650.00",
      change: "-2.3%",
      trend: "down",
      icon: CreditCardIcon,
    },
    {
      name: "Refunds This Month",
      value: "$1,245.00",
      change: "+5.1%",
      trend: "up",
      icon: BanknotesIcon,
    },
    {
      name: "Payout Requests",
      value: "$65,420.00",
      change: "+8.4%",
      trend: "up",
      icon: BanknotesIcon,
    },
  ];

  const handleRefresh = () => {
    // In a real implementation, this would fetch fresh data from the API
    alert("Refreshing payment data...");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Payment Management
          </h1>
          <p className="mt-1 text-slate-500">
            Monitor and manage platform transactions, refunds, and payouts
          </p>
        </div>
      </div>

      {/* Payment Statistics */}
      <PaymentStats stats={paymentStats} />

      {/* Revenue Chart */}
      <RevenueChart dateRange={dateRange} setDateRange={setDateRange} />

      {/* Payout Requests card only */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1">
        <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] p-6">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-slate-800">Payout Requests</h2>
              <p className="mt-1 text-slate-500">Review pending payout requests and process payments.</p>
            </div>
            <div className="pt-4">
              <Link
                href="/admin/payouts"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
              >
                Go to Payout Requests
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs removed: navigation via cards above */}
    </div>
  );
}
