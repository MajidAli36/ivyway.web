"use client";

import { useState, useEffect } from "react";
import {
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import API from "../../../../lib/api/apiService";
import PayoutNotification, {
  PayoutNotificationTypes,
} from "../../../components/shared/PayoutNotification";

export default function PlanManagement() {
  const [activePlan, setActivePlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchPlanData();
  }, []);

  const fetchPlanData = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch active plan
      const activePlanResponse = await API.getActivePlan();
      setActivePlan(activePlanResponse.data.plan || null);

      // Fetch plan history
      const historyResponse = await API.getPlanHistory();
      setPlanHistory(historyResponse.data.history || []);

      // Fetch available plans
      const plansResponse = await API.getPlans();
      setAvailablePlans(plansResponse.data.plans || []);
    } catch (err) {
      console.error("Error fetching plan data:", err);
      setError("Failed to load plan information");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanChange = async (planId) => {
    try {
      await API.changePlan({ planId });
      await fetchPlanData(); // Refresh data
      setShowChangePlanModal(false);
      setSelectedPlan(null);
      showNotification(PayoutNotificationTypes.REQUEST_SUBMITTED);
    } catch (err) {
      console.error("Error changing plan:", err);
      showNotification({
        type: "error",
        message: API.handleError(err),
      });
    }
  };

  const showNotification = (notificationType) => {
    setNotification({
      type: notificationType.type,
      message: notificationType.message,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  const getPlanStatus = (plan) => {
    if (!plan) return "No Plan";

    const now = new Date();
    const endDate = new Date(plan.endDate);

    if (endDate < now) {
      return "Expired";
    } else if (plan.sessionsUsed >= plan.totalSessions) {
      return "Used Up";
    } else {
      return "Active";
    }
  };

  const getPlanStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      case "Used Up":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={fetchPlanData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
        </div>

        {activePlan ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {activePlan.name}
                </h4>
                <p className="text-gray-600">{activePlan.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getPlanStatusColor(
                  getPlanStatus(activePlan)
                )}`}
              >
                {getPlanStatus(activePlan)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Sessions Used
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  {activePlan.sessionsUsed} / {activePlan.totalSessions}
                </p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (activePlan.sessionsUsed / activePlan.totalSessions) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Price
                  </span>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mt-1">
                  ${activePlan.price}
                </p>
                <p className="text-sm text-gray-500">One-time payment</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Valid Until
                  </span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {formatDate(activePlan.endDate)}
                </p>
                <p className="text-sm text-gray-500">
                  {Math.ceil(
                    (new Date(activePlan.endDate) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days remaining
                </p>
              </div>
            </div>

            {getPlanStatus(activePlan) === "Active" && (
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowChangePlanModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Change Plan
                </button>
                <button
                  onClick={() =>
                    window.open(
                      `/api/payments/${activePlan.paymentId}/invoice`,
                      "_blank"
                    )
                  }
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Download Invoice
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center">
            <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No Active Plan
            </h4>
            <p className="text-gray-600 mb-4">
              You need to purchase a plan to book tutoring sessions.
            </p>
            <button
              onClick={() => setShowChangePlanModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Choose a Plan
            </button>
          </div>
        )}
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Plans
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {plan.name}
                  </h4>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-gray-900 mb-6">
                    ${plan.price}
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    setSelectedPlan(plan);
                    setShowChangePlanModal(true);
                  }}
                  disabled={
                    activePlan && getPlanStatus(activePlan) === "Active"
                  }
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {activePlan && getPlanStatus(activePlan) === "Active"
                    ? "Plan Active"
                    : "Choose Plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan History */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Plan History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {planHistory.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(plan.purchaseDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(plan.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getPlanStatusColor(
                        getPlanStatus(plan)
                      )}`}
                    >
                      {getPlanStatus(plan)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${plan.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {planHistory.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No plan history
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Your plan history will appear here once you purchase a plan.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Change Plan Modal */}
      {showChangePlanModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowChangePlanModal(false)}
            />

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedPlan
                      ? `Change to ${selectedPlan.name}`
                      : "Choose a Plan"}
                  </h3>
                  <button
                    onClick={() => setShowChangePlanModal(false)}
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {selectedPlan && (
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        {selectedPlan.name}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {selectedPlan.description}
                      </p>
                      <div className="text-2xl font-bold text-gray-900 mb-4">
                        ${selectedPlan.price}
                      </div>

                      <ul className="space-y-2 mb-4">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowChangePlanModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  {selectedPlan && (
                    <button
                      onClick={() => handlePlanChange(selectedPlan.id)}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Purchase Plan
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <PayoutNotification
          type={notification.type}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={hideNotification}
        />
      )}
    </div>
  );
}
