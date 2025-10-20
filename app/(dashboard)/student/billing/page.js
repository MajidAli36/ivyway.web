"use client";
import { useEffect, useState } from "react";
import BillingStats from "./components/BillingStats";
import SubscriptionTab from "./components/SubscriptionTab";
import PaymentMethodsTab from "./components/PaymentMethodsTab";
import BillingHistoryTab from "./components/BillingHistoryTab";
import PlanManagement from "./components/PlanManagement";
import PlanPurchaseModal from "./components/PlanPurchaseModal";
import ServiceSelection from "../../../components/services/ServiceSelection";
import PlanCard from "../../../components/plans/PlanCard";
import { ServiceTypes, getServicePlans } from "../../../constants/serviceTypes";
import { apiGet } from "../utils/api";

export default function StudentBilling() {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [activePlan, setActivePlan] = useState(null);
  const [planHistory, setPlanHistory] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedService, setSelectedService] = useState(ServiceTypes.TUTORING);
  const [servicePlans, setServicePlans] = useState([]);

  const handlePurchasePlan = (plan) => {
    setSelectedPlan(plan);
    setShowPurchaseModal(true);
  };

  const handlePurchaseSuccess = (purchaseData) => {
    // Refresh plans and active plan data
    fetchPlans();
    // You could also refresh the plan history here
    setShowPurchaseModal(false);
    setSelectedPlan(null);
  };

  const handleServiceSelect = async (serviceType) => {
    setSelectedService(serviceType);

    try {
      // First try to get real plans from API
      const response = await apiGet("plans");
      const apiPlans = Array.isArray(response.data)
        ? response.data
        : response.plans || [];

      if (apiPlans.length > 0) {
        // Filter plans by service type if they have a serviceType field
        const filteredPlans = apiPlans.filter(
          (plan) => !plan.serviceType || plan.serviceType === serviceType
        );
        setServicePlans(filteredPlans.length > 0 ? filteredPlans : apiPlans);
      } else {
        // Fallback to mock plans if no API plans available
        const plans = getServicePlans(serviceType);
        setServicePlans(plans);
      }
    } catch (err) {
      console.warn("Failed to fetch plans from API, using mock plans:", err);
      // Fallback to mock plans on API error
      const plans = getServicePlans(serviceType);
      setServicePlans(plans);
    }
  };

  useEffect(() => {
    async function fetchPlans() {
      setLoading(true);
      setError(null);
      try {
        const activeRes = await apiGet("plans/user");
        const plan = activeRes.data?.userPlan || null;
        setActivePlan(plan);
        const historyRes = await apiGet("users/plan/history");
        setPlanHistory(historyRes.data || historyRes.history || []);
      } catch (err) {
        // Only set error if it's not a 404/no active plan
        if (err.status && err.status === 404) {
          setActivePlan(null);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  useEffect(() => {
    async function fetchAvailablePlans() {
      setPlansLoading(true);
      setPlansError(null);
      try {
        const plansRes = await apiGet("plans");
        setAvailablePlans(
          Array.isArray(plansRes.data) ? plansRes.data : plansRes.plans || []
        );
      } catch (err) {
        setPlansError(err.message);
      } finally {
        setPlansLoading(false);
      }
    }
    fetchAvailablePlans();
  }, []);

  // Initialize service plans on component mount
  useEffect(() => {
    const initializeServicePlans = async () => {
      try {
        // First try to get real plans from API
        const response = await apiGet("plans");
        const apiPlans = Array.isArray(response.data)
          ? response.data
          : response.plans || [];

        if (apiPlans.length > 0) {
          // Filter plans by service type if they have a serviceType field
          const filteredPlans = apiPlans.filter(
            (plan) => !plan.serviceType || plan.serviceType === selectedService
          );
          setServicePlans(filteredPlans.length > 0 ? filteredPlans : apiPlans);
        } else {
          // Fallback to mock plans if no API plans available
          const plans = getServicePlans(selectedService);
          setServicePlans(plans);
        }
      } catch (err) {
        console.warn("Failed to fetch plans from API, using mock plans:", err);
        // Fallback to mock plans on API error
        const plans = getServicePlans(selectedService);
        setServicePlans(plans);
      }
    };

    initializeServicePlans();
  }, [selectedService]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-100 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#243b53]">
          Subscription Management
        </h1>
        <p className="text-[#4b5563] mt-1">
          Manage your subscriptions, payment methods, and billing history
        </p>
      </div>

      {/* Active Plan Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#334e68] mb-2">
          Active Plan
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : activePlan && activePlan.Plan ? (
          <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#334e68]">
                  {activePlan.Plan.name}
                </h3>
                <p className="text-gray-600">{activePlan.Plan.description}</p>
                <p className="text-gray-500 text-sm">
                  Type: {activePlan.Plan.type}
                </p>
                <p className="text-blue-700 font-medium mt-2">
                  Sessions Remaining:{" "}
                  {activePlan.Plan.sessionCount -
                    (activePlan.sessionsUsed || 0)}{" "}
                  / {activePlan.Plan.sessionCount}
                </p>
                {activePlan.renewalDate && (
                  <p className="text-gray-400 text-xs mt-1">
                    Renews on:{" "}
                    {new Date(activePlan.renewalDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activePlan.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {activePlan.status}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
            No active subscription found.
          </div>
        )}
      </div>

      {/* Plan History Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#334e68] mb-2">
          Plan History
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : planHistory.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
            No plan history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Sessions Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Total Sessions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {planHistory.map((ph) => (
                  <tr key={ph.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#334e68]">
                      {ph.Plan?.name || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ph.status === "active"
                            ? "bg-green-100 text-green-800"
                            : ph.status === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ph.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ph.sessionsUsed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ph.Plan?.sessionCount || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ph.createdAt
                        ? new Date(ph.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ph.renewalDate
                        ? new Date(ph.renewalDate).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BillingStats />

      <div className="mt-8 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {[
              { key: "subscriptions", label: "My Subscription" },
              { key: "payment-methods", label: "Payment Methods" },
              { key: "billing-history", label: "Billing History" },
              // { key: "plan-management", label: "Plan Management" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`${
                  activeTab === tab.key
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-[#6b7280] hover:text-[#243b53] hover:border-gray-300"
                } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "subscriptions" && <SubscriptionTab />}
        {activeTab === "payment-methods" && <PaymentMethodsTab />}
        {activeTab === "billing-history" && <BillingHistoryTab />}
        {/* {activeTab === "plan-management" && <PlanManagement />} */}
      </div>

      {/* Service Selection Section */}
      <div className="mt-8">
        <ServiceSelection
          onSelectService={handleServiceSelect}
          selectedService={selectedService}
          variant="featured"
          className="bg-white rounded-2xl shadow-lg p-8"
        />
      </div>

      {/* Service-Specific Pricing Plans */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-[#334e68]">
            {selectedService === ServiceTypes.COUNSELING
              ? "Counseling"
              : selectedService === ServiceTypes.TEST_PREP
              ? "Test Prep"
              : selectedService === ServiceTypes.IWGSP
              ? "IWGSP"
              : "Tutoring"}{" "}
            Plans
          </h2>
          <div className="text-sm text-gray-600">
            Choose the plan that works best for you
          </div>
        </div>

        {servicePlans.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-gray-500 mb-2">
              No plans available for this service
            </div>
            <div className="text-sm text-gray-400">
              Please select a different service type
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicePlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={() => handlePurchasePlan(plan)}
                variant="comparison"
                showFeatures={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Legacy Available Plans (Fallback) */}
      {availablePlans.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-[#334e68] mb-4">
            All Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availablePlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#334e68] mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{plan.description}</p>
                  <div className="text-blue-700 font-semibold text-xl mb-1">
                    {typeof plan.price === "number"
                      ? `$${plan.price.toFixed(2)}`
                      : plan.price && !isNaN(Number(plan.price))
                      ? `$${Number(plan.price).toFixed(2)}`
                      : "-"}
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    Type: {plan.type}
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    Sessions: {plan.sessionCount || "-"}
                  </div>
                </div>
                <button
                  onClick={() => handlePurchasePlan(plan)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Purchase Modal */}
      <PlanPurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => {
          setShowPurchaseModal(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onSuccess={handlePurchaseSuccess}
      />
    </div>
  );
}
