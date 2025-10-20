"use client";
import { useState, useEffect } from "react";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import { apiGet } from "../../utils/api";

export default function SubscriptionTab() {
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChangePlan = () => {
    setShowPlanModal(true);
  };

  const handleCancelSubscription = () => {
    alert("This would open subscription cancellation confirmation");
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const userPlanRes = await apiGet("plans/user");
        const userPlan = userPlanRes.data?.userPlan || null;
        setCurrentSubscription(userPlan);
        const plansRes = await apiGet("plans");
        console.log("plansRes", plansRes);
        setAvailablePlans(
          Array.isArray(plansRes.data)
            ? plansRes.data
            : Array.isArray(plansRes.plans)
            ? plansRes.plans
            : plansRes
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // For demo, use the first plan as upcoming payment (customize as needed)
  const upcomingPayment =
    currentSubscription && currentSubscription.Plan
      ? {
          id: currentSubscription.id,
          dueDate: currentSubscription.renewalDate,
          amount: currentSubscription.Plan.price,
          description: currentSubscription.Plan.name,
        }
      : null;

  // Defensive: ensure availablePlans is always an array
  const plansArray = Array.isArray(availablePlans) ? availablePlans : [];

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-[#243b53] mb-4">
          Current Subscription
        </h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : !currentSubscription || !currentSubscription.Plan ? (
          <></>
        ) : (
          <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="text-xl font-semibold text-[#334e68]">
                    {currentSubscription.Plan.name}
                  </h3>
                  <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {currentSubscription.status}
                  </span>
                </div>
                <p className="mt-1 text-gray-600">
                  {currentSubscription.Plan.description}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-gray-500">
                      Price
                    </h4>
                    <p className="text-lg font-semibold text-blue-600">
                      {typeof currentSubscription.Plan.price === "number"
                        ? `$${currentSubscription.Plan.price.toFixed(2)}`
                        : currentSubscription.Plan.price &&
                          !isNaN(Number(currentSubscription.Plan.price))
                        ? `$${Number(currentSubscription.Plan.price).toFixed(
                            2
                          )}`
                        : "-"}
                      /{currentSubscription.Plan.type}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase text-gray-500">
                      Next Billing
                    </h4>
                    <p className="text-sm text-gray-700">
                      {currentSubscription.renewalDate
                        ? new Date(
                            currentSubscription.renewalDate
                          ).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Included in your plan:
                  </h4>
                  <ul className="space-y-1">
                    {(currentSubscription.Plan.features || []).map(
                      (feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-3 justify-end">
              <button
                onClick={handleChangePlan}
                className="px-4 py-2 text-sm border border-blue-600 rounded-full text-blue-600 hover:bg-indigo-50 transition-colors"
              >
                Change Plan
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 text-sm border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Payment */}
      {upcomingPayment && (
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-amber-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium text-[#334e68]">
                    Next Payment: {upcomingPayment.description}
                  </h3>
                  <p className="text-sm text-[#6b7280]">
                    Due on{" "}
                    {upcomingPayment.dueDate
                      ? new Date(upcomingPayment.dueDate).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-semibold text-[#334e68]">
                  $
                  {typeof upcomingPayment.amount === "number"
                    ? upcomingPayment.amount.toFixed(2)
                    : "-"}
                </span>
                <p className="text-xs text-amber-600 mt-1">
                  Will be charged automatically
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#243b53]">
            Other Available Plans
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plansArray.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl p-4 relative ${
                plan.isPopular
                  ? "border-indigo-200 bg-indigo-50"
                  : "border-gray-200"
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
              <div className="mt-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/{plan.type}</span>
                {plan.bulkDiscount && (
                  <div className="text-xs text-blue-600 mt-1 font-medium">
                    {plan.bulkDiscount}
                  </div>
                )}
              </div>
              <ul className="space-y-2 mb-4">
                {(plan.features || []).slice(0, 3).map((feature, idx) => (
                  <li key={idx} className="flex text-sm">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
                {plan.features && plan.features.length > 3 && (
                  <li className="text-sm text-gray-500">
                    +{plan.features.length - 3} more features
                  </li>
                )}
              </ul>
              <button
                className={`w-full py-2 rounded-lg text-sm font-medium ${
                  plan.isPopular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 text-gray-800 hover:bg-gray-50"
                }`}
              >
                {plan.type === "multi_hour"
                  ? "Book Sessions"
                  : "Switch to this plan"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
