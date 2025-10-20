import React, { useState, useEffect } from "react";
import { apiGet, apiPost } from "../../utils/api";

export default function PlanSelection({
  onSelectPlan = () => {},
  initialSelectedPlan = null,
}) {
  const [plans, setPlans] = useState([]);
  const [selected, setSelected] = useState(initialSelectedPlan?.id || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    async function fetchPlans() {
      try {
        const res = await apiGet("plans");
        const plans = res.data?.plans || [];
        console.log("Fetched plans:", plans);
        setPlans(plans);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan) => {
    setSelected(plan.id); // Always use the UUID
    onSelectPlan(plan);
  };

  const handlePurchase = async (planId) => {
    setPurchasing(true);
    try {
      const plan = plans.find((p) => p.id === planId);
      console.log("Attempting to purchase plan:", plan);
      console.log("planId sent in POST:", planId);
      if (
        !planId ||
        !plan ||
        !/^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/.test(
          planId
        )
      ) {
        alert("Invalid plan selected. Please select a valid plan.");
        setPurchasing(false);
        return;
      }
      await apiPost("users/plan/change", { planId }); // Always send the UUID
      alert("Plan purchased successfully!");
    } catch (err) {
      alert("Failed to purchase plan: " + err.message);
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return <div className="p-6">Loading plans...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Choose Your <span className="text-blue-600">Tutoring Plan</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Select the perfect plan that fits your learning goals and schedule.
            All plans include personalized instruction and progress tracking.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4 mb-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handleSelectPlan(plan)}
              className={`relative rounded-2xl border-2 p-6 flex flex-col cursor-pointer transition-all duration-300 ${
                selected === plan.id
                  ? "border-blue-500 ring-4 ring-blue-500/20"
                  : "border-gray-200 hover:border-blue-400 hover:shadow-lg"
              }`}
            >
              {/* Plan Header */}
              <div className="flex-grow">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {plan.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-extrabold text-gray-900">
                      {typeof plan.calculatedPrice === "number"
                        ? `$${plan.calculatedPrice.toFixed(2)}`
                        : plan.calculatedPrice && !isNaN(Number(plan.calculatedPrice))
                        ? `$${Number(plan.calculatedPrice).toFixed(2)}`
                        : typeof plan.price === "number"
                        ? `$${plan.price.toFixed(2)}`
                        : plan.price && !isNaN(Number(plan.price))
                        ? `$${Number(plan.price).toFixed(2)}`
                        : "-"}
                    </div>
                    <div className="text-sm text-gray-500">{plan.type}</div>
                    {plan.discountPercentage > 0 && (
                      <div className="text-xs text-green-600 font-medium">
                        {plan.discountPercentage}% discount
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 min-h-[3rem]">
                  {plan.description}
                </p>
                <div className="text-sm text-gray-500 space-y-2">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-medium text-gray-700">
                      {plan.sessionCount} session
                      {plan.sessionCount > 1 ? "s" : ""} • {plan.duration} min
                    </span>
                  </div>
                </div>
              </div>
              {/* Select & Purchase Button */}
              <div className="mt-6">
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 ${
                    selected === plan.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-100"
                  }`}
                  disabled={purchasing}
                  onClick={() => handlePurchase(plan.id)}
                >
                  {purchasing && selected === plan.id
                    ? "Purchasing..."
                    : "Select & Purchase"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <div className="inline-flex items-center bg-white rounded-full px-6 py-3 shadow-md border border-gray-200">
            <svg
              className="w-5 h-5 text-green-500 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-gray-600">
              All plans include secure payment and flexible scheduling.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
