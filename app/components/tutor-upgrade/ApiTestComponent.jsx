"use client";

import { useState, useEffect } from "react";
import tutorUpgradeService from "@/app/lib/api/tutorUpgradeService";

export default function ApiTestComponent() {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const runApiTests = async () => {
    setLoading(true);
    const results = {};

    try {
      // Test eligibility API
      console.log("Testing eligibility API...");
      const eligibilityResponse = await tutorUpgradeService.checkEligibility();
      console.log("Raw Eligibility response:", eligibilityResponse);
      results.eligibility = {
        success: eligibilityResponse.success,
        data: eligibilityResponse.data,
        message: eligibilityResponse.message
      };
      console.log("Processed Eligibility response:", results.eligibility);
    } catch (error) {
      results.eligibility = {
        success: false,
        error: error.message
      };
      console.error("Eligibility error:", error);
    }

    try {
      // Test stats API
      console.log("Testing stats API...");
      const statsResponse = await tutorUpgradeService.getTutorStats();
      console.log("Raw Stats response:", statsResponse);
      results.stats = {
        success: statsResponse.success,
        data: statsResponse.data,
        message: statsResponse.message
      };
      console.log("Processed Stats response:", results.stats);
    } catch (error) {
      results.stats = {
        success: false,
        error: error.message
      };
      console.error("Stats error:", error);
    }

    try {
      // Test application status API
      console.log("Testing application status API...");
      const statusResponse = await tutorUpgradeService.getApplicationStatus();
      console.log("Raw Status response:", statusResponse);
      
      // Handle null response
      if (statusResponse === null) {
        results.status = {
          success: false,
          data: null,
          message: "API returned null response",
          error: "No data received from application status API"
        };
      } else {
        results.status = {
          success: statusResponse.success || false,
          data: statusResponse.data,
          message: statusResponse.message || "No message provided"
        };
      }
      console.log("Processed Status response:", results.status);
    } catch (error) {
      results.status = {
        success: false,
        error: error.message
      };
      console.error("Status error:", error);
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runApiTests();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">API Test Results</h3>
        <button
          onClick={runApiTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Run API Tests
            </>
          )}
        </button>
      </div>

      {Object.keys(testResults).length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2">Click "Run API Tests" to test the endpoints</p>
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(testResults).map(([apiName, result]) => (
          <div key={apiName} className="border rounded-lg p-6 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900 capitalize">
                {apiName === 'eligibility' && 'Eligibility Check'}
                {apiName === 'stats' && 'Tutor Statistics'}
                {apiName === 'status' && 'Application Status'}
              </h4>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.success ? (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Success
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Failed
                  </>
                )}
              </span>
            </div>
            
            {result.success ? (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h5 className="font-medium text-gray-900 mb-2">Response Message</h5>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border">
                  <h5 className="font-medium text-gray-900 mb-2">Response Data</h5>
                  <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-64">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-medium text-red-800 mb-2">Error Details</h5>
                <p className="text-sm text-red-700">{result.error}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
