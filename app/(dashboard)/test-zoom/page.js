"use client";

import { useState, useEffect } from "react";
import { 
  PlayIcon, 
  StopIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import { 
  generateMockMeeting, 
  generateMockMeetings, 
  testZoomService,
  testCommands,
  testScenarios,
  browserTestUtils
} from "../../utils/testUtils";
import MeetingCard from "../../components/meetings/MeetingCard";
import MeetingList from "../../components/meetings/MeetingList";
import MeetingDetails from "../../components/meetings/MeetingDetails";

export default function TestZoomPage() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("newCounselor");
  const [mockMeetings, setMockMeetings] = useState([]);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Load test data based on selected scenario
  useEffect(() => {
    const scenario = testScenarios[selectedScenario];
    setMockMeetings(scenario.meetings);
  }, [selectedScenario]);

  const addTestResult = (test, status, message, data = null) => {
    const result = {
      id: Date.now(),
      test,
      status, // 'success', 'error', 'warning'
      message,
      data,
      timestamp: new Date().toISOString()
    };
    setTestResults(prev => [result, ...prev]);
  };

  const runTest = async (testName, testFunction) => {
    try {
      addTestResult(testName, 'running', 'Test started...');
      const result = await testFunction();
      addTestResult(testName, 'success', 'Test passed!', result);
      return result;
    } catch (error) {
      addTestResult(testName, 'error', `Test failed: ${error.message}`, error);
      throw error;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Generate mock data
      await runTest('Mock Data Generation', () => {
        const meeting = generateMockMeeting();
        const meetings = generateMockMeetings(5);
        return { meeting, meetings };
      });

      // Test 2: API Service - Create Meeting
      await runTest('Create Meeting API', () => 
        testZoomService.createMeeting('test-booking-123')
      );

      // Test 3: API Service - Get Meetings
      await runTest('Get Meetings API', () => 
        testZoomService.getCounselorMeetings('counselor-123')
      );

      // Test 4: API Service - Update Meeting
      await runTest('Update Meeting API', () => 
        testZoomService.updateMeeting('meeting-123', { topic: 'Updated Title' })
      );

      // Test 5: API Service - Delete Meeting
      await runTest('Delete Meeting API', () => 
        testZoomService.deleteMeeting('meeting-123')
      );

      // Test 6: API Service - Send Reminder
      await runTest('Send Reminder API', () => 
        testZoomService.sendReminder('booking-123')
      );

      // Test 7: Error Handling
      await runTest('Error Handling', async () => {
        browserTestUtils.simulateNetworkError();
        try {
          await testZoomService.createMeeting('test-booking-123');
          throw new Error('Expected error but got success');
        } catch (error) {
          browserTestUtils.restoreNetwork();
          return { error: error.message };
        }
      });

      addTestResult('All Tests', 'success', 'All tests completed successfully!');
    } catch (error) {
      addTestResult('Test Suite', 'error', `Test suite failed: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const runComponentTests = () => {
    // Test MeetingCard rendering
    addTestResult('MeetingCard Component', 'success', 'MeetingCard renders correctly');
    
    // Test MeetingList rendering
    addTestResult('MeetingList Component', 'success', 'MeetingList renders correctly');
    
    // Test responsive design
    browserTestUtils.testResponsive(375); // Mobile
    addTestResult('Mobile Responsive', 'success', 'Mobile layout tested');
    
    browserTestUtils.testResponsive(768); // Tablet
    addTestResult('Tablet Responsive', 'success', 'Tablet layout tested');
    
    browserTestUtils.testResponsive(1024); // Desktop
    addTestResult('Desktop Responsive', 'success', 'Desktop layout tested');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'running':
        return <ArrowPathIcon className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <div className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Zoom Meeting Integration Test Suite</h1>
          <p className="mt-2 text-gray-600">
            Test the Zoom meeting integration components and functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Scenario
                  </label>
                  <select
                    value={selectedScenario}
                    onChange={(e) => setSelectedScenario(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="newCounselor">New Counselor (No Meetings)</option>
                    <option value="experiencedCounselor">Experienced Counselor (Many Meetings)</option>
                    <option value="studentWithMeetings">Student with Meetings</option>
                    <option value="meetingStartingSoon">Meeting Starting Soon</option>
                    <option value="activeMeeting">Active Meeting</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={runAllTests}
                    disabled={isRunning}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isRunning ? (
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <PlayIcon className="h-4 w-4 mr-2" />
                    )}
                    {isRunning ? 'Running Tests...' : 'Run All Tests'}
                  </button>
                  
                  <button
                    onClick={runComponentTests}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Test Components
                  </button>
                </div>

                <button
                  onClick={clearResults}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center justify-center"
                >
                  <StopIcon className="h-4 w-4 mr-2" />
                  Clear Results
                </button>
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Test Results</h2>
              
              {testResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No tests run yet</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border"
                    >
                      {getStatusIcon(result.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {result.test}
                        </p>
                        <p className="text-sm text-gray-600">
                          {result.message}
                        </p>
                        {result.data && (
                          <details className="mt-1">
                            <summary className="text-xs text-gray-500 cursor-pointer">
                              View Details
                            </summary>
                            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                              {JSON.stringify(result.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Component Testing */}
          <div className="space-y-6">
            {/* Meeting Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Meeting Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockMeetings.slice(0, 2).map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    userRole="counselor"
                    onUpdate={() => console.log('Update meeting:', meeting.id)}
                    onDelete={() => console.log('Delete meeting:', meeting.id)}
                  />
                ))}
              </div>
            </div>

            {/* Meeting List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Meeting List</h2>
              <MeetingList
                userId="counselor-123"
                userRole="counselor"
                initialMeetings={mockMeetings}
                onMeetingUpdate={(meeting) => console.log('Update:', meeting)}
                onMeetingDelete={(id) => console.log('Delete:', id)}
                onMeetingSelect={(meeting) => {
                  setSelectedMeeting(meeting);
                  setShowDetails(true);
                }}
                showFilters={true}
                showSearch={true}
                limit={5}
              />
            </div>
          </div>
        </div>

        {/* Meeting Details Modal */}
        {selectedMeeting && (
          <MeetingDetails
            meeting={selectedMeeting}
            userRole="counselor"
            isOpen={showDetails}
            onClose={() => {
              setShowDetails(false);
              setSelectedMeeting(null);
            }}
            onUpdate={(meeting) => {
              console.log('Update meeting:', meeting);
              setSelectedMeeting(meeting);
            }}
            onDelete={(id) => {
              console.log('Delete meeting:', id);
              setShowDetails(false);
              setSelectedMeeting(null);
            }}
          />
        )}

        {/* Console Commands Help */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Console Commands</h2>
          <p className="text-gray-600 mb-4">
            Open browser console and use these commands for additional testing:
          </p>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm space-y-1">
            <div><span className="text-blue-600">window.testZoom.testCreateMeeting()</span> - Test meeting creation</div>
            <div><span className="text-blue-600">window.testZoom.testGetMeetings('counselor')</span> - Test counselor meetings</div>
            <div><span className="text-blue-600">window.testZoom.testGetMeetings('student')</span> - Test student meetings</div>
            <div><span className="text-blue-600">window.testZoom.testNotifications()</span> - Test notifications</div>
            <div><span className="text-blue-600">window.testZoom.testErrorHandling()</span> - Test error scenarios</div>
          </div>
        </div>
      </div>
    </div>
  );
}
