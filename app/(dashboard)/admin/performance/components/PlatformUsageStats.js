"use client";
import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, PolarArea } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement
);

const PlatformUsageStats = ({ data }) => {
  if (!data) return null;

  const { deviceStats, pageViews, featureUsage, sessionStats } = data;

  const deviceChartData = {
    labels: Object.keys(deviceStats),
    datasets: [
      {
        label: "Device Usage",
        data: Object.values(deviceStats),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const featureChartData = {
    labels: Object.keys(featureUsage),
    datasets: [
      {
        label: "Feature Usage",
        data: Object.values(featureUsage),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Platform Usage Statistics
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Insights into how users are engaging with the platform
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Session Statistics
            </h4>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-500">
                  Average Session Duration
                </dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {sessionStats.avgDuration} mins
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Sessions Today</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {sessionStats.today}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Upcoming Sessions</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {sessionStats.upcoming}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-500">Completion Rate</dt>
                <dd className="mt-1 text-lg font-semibold text-gray-900">
                  {sessionStats.completionRate}%
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Device Distribution
            </h4>
            <div className="h-48">
              <Doughnut data={deviceChartData} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Feature Usage
            </h4>
            <div className="h-48">
              <PolarArea data={featureChartData} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-4">
              Top Pages
            </h4>
            <ul className="space-y-3">
              {pageViews.map((page, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-6 w-6 flex items-center justify-center bg-blue-600 text-xs font-medium text-white rounded-full">
                    {index + 1}
                  </span>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {page.path}
                      </span>
                      <span className="text-sm text-gray-500">
                        {page.views}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${
                            (page.views /
                              Math.max(...pageViews.map((p) => p.views))) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h4 className="text-base font-medium text-gray-700 mb-4">
            System Performance
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">API Response Time</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {data.systemPerformance.apiResponseTime} ms
                  </dd>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.systemPerformance.apiResponseTime < 200
                        ? "bg-green-500"
                        : data.systemPerformance.apiResponseTime < 500
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        data.systemPerformance.apiResponseTime / 10,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </dl>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Error Rate</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {data.systemPerformance.errorRate}%
                  </dd>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.systemPerformance.errorRate < 1
                        ? "bg-green-500"
                        : data.systemPerformance.errorRate < 5
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        data.systemPerformance.errorRate * 10,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </dl>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Server Load</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {data.systemPerformance.serverLoad}%
                  </dd>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      data.systemPerformance.serverLoad < 50
                        ? "bg-green-500"
                        : data.systemPerformance.serverLoad < 80
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{ width: `${data.systemPerformance.serverLoad}%` }}
                  ></div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformUsageStats;
