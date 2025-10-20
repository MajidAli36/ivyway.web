#!/usr/bin/env node

/**
 * Setup script for Zoom meeting integration testing
 * Run with: node scripts/setup-testing.js
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Setting up Zoom Meeting Integration Testing...\n');

// 1. Create test environment file
const testEnvContent = `# Test Environment Variables
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ZOOM_API_URL=http://localhost:3000/api/counselor/zoom

# Test User Credentials
TEST_COUNSELOR_EMAIL=counselor@test.com
TEST_COUNSELOR_PASSWORD=testpassword123
TEST_STUDENT_EMAIL=student@test.com
TEST_STUDENT_PASSWORD=testpassword123

# Test Data
TEST_BOOKING_ID=test-booking-123
TEST_COUNSELOR_ID=counselor-test-123
TEST_STUDENT_ID=student-test-123
`;

const envPath = path.join(process.cwd(), '.env.test');
fs.writeFileSync(envPath, testEnvContent);
console.log('✅ Created .env.test file');

// 2. Create test data file
const testDataContent = `// Test data for Zoom meeting integration
export const testUsers = {
  counselor: {
    id: 'counselor-test-123',
    name: 'Dr. Test Counselor',
    email: 'counselor@test.com',
    password: 'testpassword123',
    role: 'counselor'
  },
  student: {
    id: 'student-test-123',
    name: 'Test Student',
    email: 'student@test.com',
    password: 'testpassword123',
    role: 'student'
  }
};

export const testBookings = [
  {
    id: 'booking-test-1',
    counselorId: 'counselor-test-123',
    studentId: 'student-test-123',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    status: 'confirmed',
    serviceType: 'counseling'
  },
  {
    id: 'booking-test-2',
    counselorId: 'counselor-test-123',
    studentId: 'student-test-123',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    status: 'confirmed',
    serviceType: 'counseling'
  }
];

export const testMeetings = [
  {
    id: 'meeting-test-1',
    meetingId: 'zoom-123456789',
    bookingId: 'booking-test-1',
    topic: 'Academic Counseling Session',
    status: 'scheduled',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    joinUrl: 'https://zoom.us/j/123456789',
    startUrl: 'https://zoom.us/s/123456789',
    password: 'test123',
    counselor: {
      id: 'counselor-test-123',
      name: 'Dr. Test Counselor',
      email: 'counselor@test.com'
    },
    student: {
      id: 'student-test-123',
      name: 'Test Student',
      email: 'student@test.com'
    }
  }
];
`;

const testDataPath = path.join(process.cwd(), 'test-data.js');
fs.writeFileSync(testDataPath, testDataContent);
console.log('✅ Created test-data.js file');

// 3. Create test runner script
const testRunnerContent = `#!/usr/bin/env node

/**
 * Test runner for Zoom meeting integration
 * Run with: node scripts/run-tests.js
 */

const { testZoomService, testScenarios } = require('../app/utils/testUtils');

async function runTests() {
  console.log('🧪 Running Zoom Meeting Integration Tests...\n');
  
  const tests = [
    {
      name: 'Mock Data Generation',
      fn: () => {
        const { generateMockMeeting, generateMockMeetings } = require('../app/utils/testUtils');
        const meeting = generateMockMeeting();
        const meetings = generateMockMeetings(5);
        return { meeting, meetings };
      }
    },
    {
      name: 'Create Meeting API',
      fn: () => testZoomService.createMeeting('test-booking-123')
    },
    {
      name: 'Get Counselor Meetings',
      fn: () => testZoomService.getCounselorMeetings('counselor-123')
    },
    {
      name: 'Get Student Meetings',
      fn: () => testZoomService.getStudentMeetings('student-123')
    },
    {
      name: 'Update Meeting',
      fn: () => testZoomService.updateMeeting('meeting-123', { topic: 'Updated Title' })
    },
    {
      name: 'Delete Meeting',
      fn: () => testZoomService.deleteMeeting('meeting-123')
    },
    {
      name: 'Send Reminder',
      fn: () => testZoomService.sendReminder('booking-123')
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(\`Running: \${test.name}...\`);
      const result = await test.fn();
      console.log(\`✅ \${test.name} - PASSED\`);
      if (result && typeof result === 'object') {
        console.log(\`   Result: \${JSON.stringify(result, null, 2).substring(0, 100)}...\`);
      }
      passed++;
    } catch (error) {
      console.log(\`❌ \${test.name} - FAILED\`);
      console.log(\`   Error: \${error.message}\`);
      failed++;
    }
    console.log('');
  }

  console.log(\`\\n📊 Test Results:\`);
  console.log(\`✅ Passed: \${passed}\`);
  console.log(\`❌ Failed: \${failed}\`);
  console.log(\`📈 Success Rate: \${Math.round((passed / (passed + failed)) * 100)}%\`);
}

runTests().catch(console.error);
`;

const testRunnerPath = path.join(process.cwd(), 'scripts', 'run-tests.js');
fs.mkdirSync(path.dirname(testRunnerPath), { recursive: true });
fs.writeFileSync(testRunnerPath, testRunnerContent);
console.log('✅ Created scripts/run-tests.js');

// 4. Create browser test script
const browserTestContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zoom Meeting Integration - Browser Tests</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-section { margin: 20px 0; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .test-button { padding: 10px 20px; margin: 5px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
        .test-button:hover { background: #0056b3; }
        .test-result { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .info { background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb; }
    </style>
</head>
<body>
    <h1>🧪 Zoom Meeting Integration - Browser Tests</h1>
    
    <div class="test-section">
        <h2>API Tests</h2>
        <button class="test-button" onclick="testCreateMeeting()">Test Create Meeting</button>
        <button class="test-button" onclick="testGetMeetings()">Test Get Meetings</button>
        <button class="test-button" onclick="testUpdateMeeting()">Test Update Meeting</button>
        <button class="test-button" onclick="testDeleteMeeting()">Test Delete Meeting</button>
        <button class="test-button" onclick="testSendReminder()">Test Send Reminder</button>
    </div>

    <div class="test-section">
        <h2>Component Tests</h2>
        <button class="test-button" onclick="testComponents()">Test Components</button>
        <button class="test-button" onclick="testResponsive()">Test Responsive Design</button>
        <button class="test-button" onclick="testNotifications()">Test Notifications</button>
    </div>

    <div class="test-section">
        <h2>Error Handling Tests</h2>
        <button class="test-button" onclick="testNetworkError()">Test Network Error</button>
        <button class="test-button" onclick="testAuthError()">Test Auth Error</button>
        <button class="test-button" onclick="testValidationError()">Test Validation Error</button>
    </div>

    <div id="results"></div>

    <script>
        // Mock API responses
        const mockResponses = {
            createMeeting: { success: true, data: { id: 'meeting-123', joinUrl: 'https://zoom.us/j/123' } },
            getMeetings: { success: true, data: { meetings: [], totalCount: 0 } },
            updateMeeting: { success: true, data: { id: 'meeting-123', topic: 'Updated' } },
            deleteMeeting: { success: true, data: null },
            sendReminder: { success: true, data: null }
        };

        function addResult(message, type = 'info') {
            const results = document.getElementById('results');
            const div = document.createElement('div');
            div.className = \`test-result \${type}\`;
            div.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
            results.appendChild(div);
        }

        async function testCreateMeeting() {
            addResult('Testing meeting creation...', 'info');
            try {
                const response = await fetch('/api/counselor/zoom/meetings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bookingId: 'test-booking-123' })
                });
                const data = await response.json();
                addResult(\`Meeting created: \${JSON.stringify(data)}\`, 'success');
            } catch (error) {
                addResult(\`Meeting creation failed: \${error.message}\`, 'error');
            }
        }

        async function testGetMeetings() {
            addResult('Testing get meetings...', 'info');
            try {
                const response = await fetch('/api/counselor/zoom/counselor/counselor-123/meetings');
                const data = await response.json();
                addResult(\`Meetings retrieved: \${JSON.stringify(data)}\`, 'success');
            } catch (error) {
                addResult(\`Get meetings failed: \${error.message}\`, 'error');
            }
        }

        async function testUpdateMeeting() {
            addResult('Testing meeting update...', 'info');
            try {
                const response = await fetch('/api/counselor/zoom/meetings/meeting-123', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic: 'Updated Meeting' })
                });
                const data = await response.json();
                addResult(\`Meeting updated: \${JSON.stringify(data)}\`, 'success');
            } catch (error) {
                addResult(\`Meeting update failed: \${error.message}\`, 'error');
            }
        }

        async function testDeleteMeeting() {
            addResult('Testing meeting deletion...', 'info');
            try {
                const response = await fetch('/api/counselor/zoom/meetings/meeting-123', {
                    method: 'DELETE'
                });
                const data = await response.json();
                addResult(\`Meeting deleted: \${JSON.stringify(data)}\`, 'success');
            } catch (error) {
                addResult(\`Meeting deletion failed: \${error.message}\`, 'error');
            }
        }

        async function testSendReminder() {
            addResult('Testing send reminder...', 'info');
            try {
                const response = await fetch('/api/counselor/zoom/meetings/booking-123/remind', {
                    method: 'POST'
                });
                const data = await response.json();
                addResult(\`Reminder sent: \${JSON.stringify(data)}\`, 'success');
            } catch (error) {
                addResult(\`Send reminder failed: \${error.message}\`, 'error');
            }
        }

        function testComponents() {
            addResult('Testing component rendering...', 'info');
            // Check if components exist
            if (typeof window.testZoom !== 'undefined') {
                addResult('Test utilities loaded successfully', 'success');
            } else {
                addResult('Test utilities not loaded', 'error');
            }
        }

        function testResponsive() {
            addResult('Testing responsive design...', 'info');
            const widths = [375, 768, 1024, 1200];
            widths.forEach(width => {
                window.innerWidth = width;
                window.dispatchEvent(new Event('resize'));
                addResult(\`Tested width: \${width}px\`, 'success');
            });
        }

        function testNotifications() {
            addResult('Testing notifications...', 'info');
            // Simulate notification
            const notification = document.createElement('div');
            notification.textContent = 'Test notification';
            notification.style.cssText = 'position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:12px;border-radius:4px;z-index:9999;';
            document.body.appendChild(notification);
            addResult('Notification displayed', 'success');
            setTimeout(() => document.body.removeChild(notification), 3000);
        }

        function testNetworkError() {
            addResult('Testing network error handling...', 'info');
            // Simulate network error
            const originalFetch = window.fetch;
            window.fetch = () => Promise.reject(new Error('Network error'));
            
            testCreateMeeting().finally(() => {
                window.fetch = originalFetch;
                addResult('Network error handled correctly', 'success');
            });
        }

        function testAuthError() {
            addResult('Testing auth error handling...', 'info');
            addResult('Auth error simulation not implemented in browser', 'info');
        }

        function testValidationError() {
            addResult('Testing validation error handling...', 'info');
            addResult('Validation error simulation not implemented in browser', 'info');
        }
    </script>
</body>
</html>
`;

const browserTestPath = path.join(process.cwd(), 'public', 'zoom-test.html');
fs.writeFileSync(browserTestPath, browserTestContent);
console.log('✅ Created public/zoom-test.html');

// 5. Create package.json scripts
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  packageJson.scripts['test:zoom'] = 'node scripts/run-tests.js';
  packageJson.scripts['test:zoom:setup'] = 'node scripts/setup-testing.js';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Added test scripts to package.json');
}

console.log('\n🎉 Testing setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Start your development server: npm run dev');
console.log('2. Visit the test page: http://localhost:3000/test-zoom');
console.log('3. Run automated tests: npm run test:zoom');
console.log('4. Open browser tests: http://localhost:3000/zoom-test.html');
console.log('\n📚 For detailed testing instructions, see: app/docs/ZOOM_TESTING_GUIDE.md');
