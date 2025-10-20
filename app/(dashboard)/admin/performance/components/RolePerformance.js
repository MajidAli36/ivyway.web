"use client";
import React, { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const RolePerformance = ({ data }) => {
  const [selectedRole, setSelectedRole] = useState("students");

  if (!data) return null;
  const { students, tutors, admins } = data;

  const userDistribution = {
    labels: ["Students", "Tutors", "Administrators"],
    datasets: [
      {
        label: "User Distribution",
        data: [students.totalCount, tutors.totalCount, admins.totalCount],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const getSelectedRoleData = () => {
    let roleData;
    let metricLabels;
    let metricValues;

    switch (selectedRole) {
      case "students":
        roleData = students;
        metricLabels = [
          "Active Students",
          "Completed Sessions",
          "Avg. Sessions",
          "Avg. Rating",
        ];
        metricValues = [
          roleData.activeCount,
          roleData.completedSessions,
          roleData.averageSessionsPerUser,
          roleData.averageRating,
        ];
        break;
      case "tutors":
        roleData = tutors;
        metricLabels = [
          "Active Tutors",
          "Sessions Conducted",
          "Avg. Sessions",
          "Avg. Rating",
        ];
        metricValues = [
          roleData.activeCount,
          roleData.sessionsCount,
          roleData.averageSessionsPerTutor,
          roleData.averageRating,
        ];
        break;
      case "admins":
        roleData = admins;
        metricLabels = [
          "Active Admins",
          "Actions Taken",
          "Users Managed",
          "Response Time (hrs)",
        ];
        metricValues = [
          roleData.activeCount,
          roleData.actionsTaken,
          roleData.usersManaged,
          roleData.averageResponseTime,
        ];
        break;
      default:
        roleData = students;
        metricLabels = [
          "Active Students",
          "Completed Sessions",
          "Avg. Sessions",
          "Avg. Rating",
        ];
        metricValues = [
          roleData.activeCount,
          roleData.completedSessions,
          roleData.averageSessionsPerUser,
          roleData.averageRating,
        ];
    }

    return {
      labels: metricLabels,
      datasets: [
        {
          label: `${
            selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
          } Metrics`,
          data: metricValues,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  };

  const roleMetricsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Role Performance
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Analyze performance metrics across different user roles
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <h4 className="text-base font-medium text-gray-700 mb-4">
              User Distribution
            </h4>
            <div className="h-64">
              <Pie data={userDistribution} />
            </div>
            <div className="mt-6">
              <ul className="divide-y divide-gray-200">
                {Object.entries({
                  Students: students.totalCount,
                  Tutors: tutors.totalCount,
                  Administrators: admins.totalCount,
                }).map(([role, count]) => (
                  <li key={role} className="py-3 flex justify-between text-sm">
                    <span className="text-gray-500">{role}</span>
                    <span className="font-medium text-gray-900">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <div className="mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedRole("students")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    selectedRole === "students"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Students
                </button>
                <button
                  onClick={() => setSelectedRole("tutors")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    selectedRole === "tutors"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Tutors
                </button>
                <button
                  onClick={() => setSelectedRole("admins")}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    selectedRole === "admins"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  Administrators
                </button>
              </div>
            </div>

            <div className="h-80">
              <Bar data={getSelectedRoleData()} options={roleMetricsOptions} />
            </div>

            {selectedRole === "students" && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Top Subjects
                  </h5>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {students.topSubjects.map((subject) => (
                      <li
                        key={subject.name}
                        className="py-2 flex justify-between text-sm"
                      >
                        <span className="text-gray-500">{subject.name}</span>
                        <span className="font-medium text-gray-900">
                          {subject.count} sessions
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Student Engagement
                  </h5>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="py-2 flex justify-between text-sm">
                      <dt className="text-gray-500">Session Completion Rate</dt>
                      <dd className="font-medium text-gray-900">
                        {students.sessionCompletionRate}%
                      </dd>
                    </div>
                    <div className="py-2 flex justify-between text-sm">
                      <dt className="text-gray-500">Avg. Time per Session</dt>
                      <dd className="font-medium text-gray-900">
                        {students.avgTimePerSession} mins
                      </dd>
                    </div>
                    <div className="py-2 flex justify-between text-sm">
                      <dt className="text-gray-500">Returning Students</dt>
                      <dd className="font-medium text-gray-900">
                        {students.returningStudents}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {selectedRole === "tutors" && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Top Performing Tutors
                  </h5>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {tutors.topPerformers.map((tutor) => (
                      <li
                        key={tutor.name}
                        className="py-2 flex justify-between text-sm"
                      >
                        <span className="text-gray-500">{tutor.name}</span>
                        <span className="font-medium text-gray-900">
                          {tutor.rating} / 5.0
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h5 className="text-sm font-medium text-gray-700">
                    Tutor Performance
                  </h5>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="py-2 flex justify-between text-sm">
                      <dt className="text-gray-500">Avg. Response Time</dt>
                      <dd className="font-medium text-gray-900">
                        {tutors.responseTime} hrs
                      </dd>
                    </div>
                    <div className="py-2 flex justify-between text-sm">
                      <dt className="text-gray-500">Session Success Rate</dt>
                      <dd className="font-medium text-gray-900">
                        {tutors.successRate}%
                      </dd>
                    </div>
                    <div className="py-2 flex justify-between text-sm">
                      <dt className="text-gray-500">Available Tutors</dt>
                      <dd className="font-medium text-gray-900">
                        {tutors.availableTutors}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {selectedRole === "admins" && (
              <div className="mt-6 border rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-700">
                  Administrative Actions
                </h5>
                <ul className="mt-2 divide-y divide-gray-200">
                  {admins.actionsBreakdown.map((action) => (
                    <li
                      key={action.type}
                      className="py-2 flex justify-between text-sm"
                    >
                      <span className="text-gray-500">{action.type}</span>
                      <span className="font-medium text-gray-900">
                        {action.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolePerformance;
