"use client";

import TransactionsTable from "../payments/components/TransactionsTable";

export default function AdminTransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Transactions</h1>
          <p className="mt-1 text-slate-500">View and manage all payment transactions.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] p-4">
        <TransactionsTable />
      </div>
    </div>
  );
}


