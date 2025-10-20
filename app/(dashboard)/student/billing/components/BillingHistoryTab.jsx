import { useEffect, useState } from "react";
import {
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { apiGet } from "../../utils/api";

export default function BillingHistoryTab() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await apiGet("payments/billing/history");
        setInvoices(res.data || res.invoices || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const downloadInvoice = async (invoiceId) => {
    try {
      if (!invoiceId) {
        alert("Invalid invoice ID");
        return;
      }
      const token = localStorage.getItem("jwt_token");
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const url = `${apiBase}/payments/billing/invoice/${invoiceId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      alert("Failed to download invoice");
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading billing history...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <div className="px-6 py-5">
        <h2 className="text-lg font-semibold text-[#243b53] mb-4">
          Subscription Billing History
        </h2>
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider"
                  >
                    Invoice
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#334e68]">
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                      {new Date(
                        invoice.createdAt || invoice.date
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6b7280]">
                      {invoice.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#334e68]">
                      {typeof invoice.amount === "number"
                        ? `$${invoice.amount.toFixed(2)}`
                        : invoice.amount && !isNaN(Number(invoice.amount))
                        ? `$${Number(invoice.amount).toFixed(2)}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => downloadInvoice(invoice.id)}
                        className="text-[#4f46e5] hover:text-[#4338ca] flex items-center justify-center"
                      >
                        <DocumentTextIcon className="h-5 w-5" />
                        <span className="sr-only">Download invoice</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing recent {invoices.length} months of billing history
        </p>
        <a
          href="#"
          className="text-sm font-medium text-[#4f46e5] hover:text-[#4338ca] flex items-center"
        >
          View all billing history
          <ChevronRightIcon className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
