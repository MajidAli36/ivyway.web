"use client";

import { useState, useEffect } from "react";
import PlanCard from "../../../components/plans/PlanCard";
import PlanFilters from "../../../components/plans/PlanFilters";
import PlansAPI from "../../../lib/api/plans";
import { formatPrice } from "../../../utils/planUtils";

export default function TestPlanSelection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planFilters, setPlanFilters] = useState({
    type: "",
    priceRange: { min: "", max: "" },
  });
  const [planSearch, setPlanSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    PlansAPI.getAllPlans()
      .then((data) => {
        console.log("Plans loaded:", data);
        setPlans(data);
      })
      .catch((err) => {
        console.error("Error loading plans:", err);
        setError(err.message || "Failed to load plans");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter/search plans
  let filteredPlans = plans;
  if (planFilters.type)
    filteredPlans = filteredPlans.filter((p) => p.type === planFilters.type);
  if (planFilters.priceRange.min)
    filteredPlans = filteredPlans.filter(
      (p) => p.calculatedPrice >= Number(planFilters.priceRange.min)
    );
  if (planFilters.priceRange.max)
    filteredPlans = filteredPlans.filter(
      (p) => p.calculatedPrice <= Number(planFilters.priceRange.max)
    );
  if (planSearch)
    filteredPlans = filteredPlans.filter((p) =>
      p.name.toLowerCase().includes(planSearch.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Plan Selection Test
          </h1>
          <p className="text-gray-600">Testing the new plan selection module</p>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plans...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error Loading Plans
            </h3>
            <p className="text-red-700">{error}</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Available Plans ({filteredPlans.length})
              </h2>
              <PlanFilters
                plans={plans}
                onFilterChange={setPlanFilters}
                onSearchChange={setPlanSearch}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isSelected={selectedPlan?.id === plan.id}
                  onSelect={setSelectedPlan}
                />
              ))}
            </div>

            {selectedPlan && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Selected Plan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedPlan.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium">{selectedPlan.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Original Price</p>
                    <p className="font-medium">
                      {formatPrice(selectedPlan.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Calculated Price</p>
                    <p className="font-medium">
                      {formatPrice(selectedPlan.calculatedPrice)}
                    </p>
                  </div>
                  {selectedPlan.sessionCount && (
                    <div>
                      <p className="text-sm text-gray-600">Sessions</p>
                      <p className="font-medium">{selectedPlan.sessionCount}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">
                      {selectedPlan.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        "activePlan",
                        JSON.stringify(selectedPlan)
                      );
                      alert(
                        "Plan saved to localStorage! You can now test the booking flow."
                      );
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Plan & Test Booking
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
