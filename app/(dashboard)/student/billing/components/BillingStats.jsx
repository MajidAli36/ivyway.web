import { useEffect, useState } from "react";
import {
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { apiGet } from "../../utils/api";

export default function BillingStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const userPlanRes = await apiGet("plans/user");
        const userPlan = userPlanRes.userPlan || userPlanRes;
        if (!userPlan || !userPlan.Plan) throw new Error(" ");
        setStats({
          planName: userPlan.Plan.name,
          planType: userPlan.Plan.type,
          nextBilling: userPlan.renewalDate,
          memberSince: userPlan.createdAt || userPlan.Plan.createdAt,
          paymentMethod: userPlan.paymentMethod || "-",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading billing stats...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!stats) return null;

  const billingStats = [
    {
      name: "Current Plan",
      value: stats.planName,
      icon: SparklesIcon,
      detail: stats.planType,
    },
    {
      name: "Next Billing",
      value: stats.nextBilling
        ? new Date(stats.nextBilling).toLocaleDateString()
        : "-",
      icon: ClockIcon,
      detail: stats.nextBilling
        ? new Date(stats.nextBilling).toLocaleString()
        : "-",
    },
    {
      name: "Member Since",
      value: stats.memberSince
        ? new Date(stats.memberSince).toLocaleDateString()
        : "-",
      icon: CheckCircleIcon,
      detail: "",
    },
    {
      name: "Payment Method",
      value: stats.paymentMethod,
      icon: CreditCardIcon,
      detail: "Default",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {billingStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),_0_10px_20px_-2px_rgba(0,0,0,0.04)] rounded-2xl transition-all hover:shadow-lg transform hover:scale-[1.02]"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 rounded-full bg-[#dbeafe] p-3">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-[#6b7280] truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-2xl font-semibold text-[#243b53]">
                        {stat.value}
                      </div>
                      {stat.detail && (
                        <div className="text-xs text-[#6b7280] mt-1">
                          {stat.detail}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
