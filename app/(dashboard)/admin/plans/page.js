"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useAdminPlans } from "../../../hooks/useAdminPlans";
import SuccessModal from "../../../components/shared/SuccessModal";
import PlanCard from "./components/PlanCard";
import PlanModal from "./components/PlanModal";
import PlanStats from "./components/PlanStats";
// PlanFilters removed per request

export default function AdminPlans() {
  const {
    plans,
    loading,
    error,
    refreshPlans,
    createPlan,
    updatePlan,
    deletePlan,
    stats,
  } = useAdminPlans();

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  // Filters removed; keep only search
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm("Are you sure you want to delete this plan? This action cannot be undone.")) {
      try {
        await deletePlan(planId);
        refreshPlans();
      } catch (error) {
        console.error("Error deleting plan:", error);
      }
    }
  };

  const handleSavePlan = async (planData) => {
    try {
      if (editingPlan) {
        await updatePlan(editingPlan.id, planData);
      } else {
        await createPlan(planData);
      }
      setShowModal(false);
      setEditingPlan(null);
      refreshPlans();
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving plan:", error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  // Filter plans based on search only
  const filteredPlans = plans.filter((plan) => {
    // Search filter
    if (searchTerm && !plan.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  if (error && !loading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col items-center justify-center h-96">
          <div className="text-red-600 mb-4 text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Plans</h2>
            <p className="text-gray-600">{error}</p>
          </div>
          <button
            onClick={refreshPlans}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Plan Management</h1>
          <p className="mt-1 text-slate-500">
            Create, edit, and manage tutoring plans and pricing
          </p>
        </div>
        <button
          onClick={handleCreatePlan}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Create Plan
        </button>
      </div>

      {/* Plan Statistics */}
      <PlanStats stats={stats} loading={loading} />

      {/* Search only */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plans by name..."
            className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Plans Grid */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Plans ({filteredPlans.length})
            </h2>
            <button
              onClick={refreshPlans}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading plans...</p>
          </div>
        ) : filteredPlans.length > 0 ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onEdit={() => handleEditPlan(plan)}
                  onDelete={() => handleDeletePlan(plan.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-12 text-center">
            <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {searchTerm ? "No plans match your search" : "No plans found"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? "Try adjusting your search" : "Get started by creating your first plan"}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <button
                  onClick={handleCreatePlan}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Plan
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plan Modal */}
      {showModal && (
        <PlanModal
          plan={editingPlan}
          onSave={handleSavePlan}
          onClose={handleCloseModal}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title={editingPlan ? "Plan updated successfully" : "Plan created successfully"}
        message={editingPlan ? "Your plan changes have been saved." : "Your new plan has been created."}
        type="profile"
      />
    </div>
  );
}
