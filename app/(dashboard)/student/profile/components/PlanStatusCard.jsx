import { useEffect, useState } from "react";
import { apiGet } from "../../../utils/api";

export default function PlanStatusCard() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPlan() {
      try {
        const res = await apiGet("plans/user");
        const userPlan = res.userPlan || res;
        setPlan(userPlan);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlan();
  }, []);

  if (loading) return <div className="p-6">Loading plan status...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  if (!plan || !plan.Plan) {
    return (
      <div className="border rounded-lg p-6 bg-yellow-50 text-yellow-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">No Active Plan</h3>
        <p className="mb-2">You don't have an active tutoring plan.</p>
        <a
          href="/student/book-session"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium mt-2"
        >
          Choose a Plan
        </a>
      </div>
    );
  }

  const sessionsRemaining = plan.Plan.sessionCount
    ? plan.Plan.sessionCount - (plan.sessionsUsed || 0)
    : null;

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-2">
        Current Plan: {plan.Plan.name}
      </h3>
      <p className="mb-1 text-gray-700">{plan.Plan.description}</p>
      <p className="mb-1 text-gray-500 text-sm">{plan.Plan.type}</p>
      {sessionsRemaining !== null && (
        <p className="mb-1 text-blue-700 font-medium">
          Sessions Remaining: {sessionsRemaining} / {plan.Plan.sessionCount}
        </p>
      )}
      {plan.renewalDate && (
        <p className="text-gray-400 text-xs">
          Renews on: {new Date(plan.renewalDate).toLocaleDateString()}
        </p>
      )}
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm font-medium">
          Change Plan
        </button>
        <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium">
          Cancel Plan
        </button>
      </div>
    </div>
  );
}
