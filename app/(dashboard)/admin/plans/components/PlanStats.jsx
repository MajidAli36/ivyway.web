"use client";

import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function PlanStats({ stats, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              </div>
              <div className="ml-4 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-2 h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const defaultStats = {
    totalPlans: 0,
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    planTypeBreakdown: {
      monthlyPlans: 0,
      multiHourPlans: 0,
      singlePlans: 0,
    },
    averagePlanPrice: 0,
    mostPopularPlan: null,
  };

  const displayStats = stats || defaultStats;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatIcon = (index) => {
    const icons = [CurrencyDollarIcon, UserGroupIcon, ChartBarIcon, ClockIcon];
    return icons[index] || CurrencyDollarIcon;
  };

  const getStatColor = (index) => {
    const colors = [
      "text-blue-600",
      "text-green-600", 
      "text-purple-600",
      "text-orange-600"
    ];
    return colors[index] || "text-blue-600";
  };

  const getStatBgColor = (index) => {
    const colors = [
      "bg-blue-100",
      "bg-green-100",
      "bg-purple-100", 
      "bg-orange-100"
    ];
    return colors[index] || "bg-blue-100";
  };

  const statItems = [
    {
      name: "Total Plans",
      value: displayStats.totalPlans,
      description: "Available plans",
      icon: CurrencyDollarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      name: "Active Subscriptions",
      value: displayStats.activeSubscriptions,
      description: "Current subscriptions",
      icon: UserGroupIcon,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Total Revenue",
      value: formatCurrency(displayStats.totalRevenue),
      description: "Lifetime revenue",
      icon: ChartBarIcon,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      name: "Avg Plan Price",
      value: formatCurrency(displayStats.averagePlanPrice),
      description: "Per plan average",
      icon: ClockIcon,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <div className="ml-4 w-full">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Plan Type Breakdown */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Plan Type Distribution</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {displayStats.planTypeBreakdown.monthlyPlans}
              </div>
              <div className="text-sm text-gray-600">Monthly Plans</div>
              <div className="text-xs text-gray-500">
                {displayStats.totalPlans > 0 
                  ? `${Math.round((displayStats.planTypeBreakdown.monthlyPlans / displayStats.totalPlans) * 100)}%`
                  : "0%"
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {displayStats.planTypeBreakdown.multiHourPlans}
              </div>
              <div className="text-sm text-gray-600">Multi-Hour Plans</div>
              <div className="text-xs text-gray-500">
                {displayStats.totalPlans > 0 
                  ? `${Math.round((displayStats.planTypeBreakdown.multiHourPlans / displayStats.totalPlans) * 100)}%`
                  : "0%"
                }
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {displayStats.planTypeBreakdown.singlePlans}
              </div>
              <div className="text-sm text-gray-600">Single Sessions</div>
              <div className="text-xs text-gray-500">
                {displayStats.totalPlans > 0 
                  ? `${Math.round((displayStats.planTypeBreakdown.singlePlans / displayStats.totalPlans) * 100)}%`
                  : "0%"
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      {displayStats.mostPopularPlan && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Most Popular Plan</h3>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  {displayStats.mostPopularPlan.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {displayStats.mostPopularPlan.type} • {formatCurrency(displayStats.mostPopularPlan.price)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {displayStats.mostPopularPlan.subscriptionCount}
                </div>
                <div className="text-sm text-gray-500">Subscriptions</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
