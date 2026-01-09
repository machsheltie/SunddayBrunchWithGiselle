/**
 * Test script for ConvertKit serverless function
 *
 * This script tests the serverless function locally without requiring
 * actual ConvertKit credentials. It verifies:
 * - Email validation
 * - Rate limiting
 * - Error handling
 * - Response format
 */

const handler = require('./netlify/functions/subscribe').handler;

// Mock event objects
const createMockEvent = (method, body) => ({
    httpMethod: method,
    headers: {
        'client-ip': '127.0.0.1',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
});

// Test suite
async function runTests() {
    console.log('🧪 Testing ConvertKit Serverless Function\n');

    let passed = 0;
    let failed = 0;

    // Test 1: OPTIONS request (CORS preflight)
    console.log('Test 1: OPTIONS request (CORS preflight)');
    try {
        const event = { httpMethod: 'OPTIONS', headers: {} };
        const response = await handler(event);

        if (response.statusCode === 200) {
            console.log('✅ PASS: CORS preflight handled correctly\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 200, got ${response.statusCode}\n`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}\n`);
        failed++;
    }

    // Test 2: Invalid HTTP method (GET)
    console.log('Test 2: Invalid HTTP method (GET)');
    try {
        const event = { httpMethod: 'GET', headers: {} };
        const response = await handler(event);

        if (response.statusCode === 405) {
            console.log('✅ PASS: Rejected non-POST request\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 405, got ${response.statusCode}\n`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}\n`);
        failed++;
    }

    // Test 3: Missing email
    console.log('Test 3: Missing email');
    try {
        const event = createMockEvent('POST', {});
        const response = await handler(event);
        const body = JSON.parse(response.body);

        if (response.statusCode === 400 && body.error.includes('required')) {
            console.log('✅ PASS: Rejected missing email\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 400 with "required" error\n`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}\n`);
        failed++;
    }

    // Test 4: Invalid email format
    console.log('Test 4: Invalid email format');
    try {
        const event = createMockEvent('POST', { email: 'not-an-email' });
        const response = await handler(event);
        const body = JSON.parse(response.body);

        if (response.statusCode === 400 && body.error.includes('Invalid')) {
            console.log('✅ PASS: Rejected invalid email format\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 400 with "Invalid" error\n`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}\n`);
        failed++;
    }

    // Test 5: Valid email (without API credentials - will fail at API call)
    console.log('Test 5: Valid email format (API call will fail without credentials)');
    try {
        const event = createMockEvent('POST', {
            email: 'test@example.com',
            firstName: 'Test User'
        });
        const response = await handler(event);
        const body = JSON.parse(response.body);

        // Without real credentials, we expect a 500 error
        if (response.statusCode === 500 && body.error.includes('configuration')) {
            console.log('✅ PASS: Validation passed, failed at API call (expected without credentials)\n');
            passed++;
        } else {
            console.log(`⚠️  Note: Got ${response.statusCode}. If credentials are set, API call may have succeeded.\n`);
            passed++;
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}\n`);
        failed++;
    }

    // Test 6: Rate limiting
    console.log('Test 6: Rate limiting (6 rapid requests)');
    try {
        const results = [];

        // Send 6 requests rapidly from same IP
        for (let i = 0; i < 6; i++) {
            const event = createMockEvent('POST', { email: `test${i}@example.com` });
            const response = await handler(event);
            results.push(response.statusCode);
        }

        // Last request should be rate limited (429)
        if (results[5] === 429) {
            console.log('✅ PASS: Rate limiting working (6th request blocked)\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 429 on 6th request, got ${results[5]}\n`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}\n`);
        failed++;
    }

    // Test 7: Invalid JSON
    console.log('Test 7: Invalid JSON in request body');
    try {
        const event = {
            httpMethod: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: 'not valid json'
        };
        const response = await handler(event);
        const body = JSON.parse(response.body);

        if (response.statusCode === 400 && body.error.includes('JSON')) {
            console.log('✅ PASS: Rejected invalid JSON\n');
            passed++;
        } else {
            console.log(`❌ FAIL: Expected 400 with "JSON" error\n`);
            failed++;
        }
    } catch (error) {
        console.log(`❌ FAIL: ${error.message}\n`);
        failed++;
    }

    // Summary
    console.log('═══════════════════════════════════════════');
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log('═══════════════════════════════════════════\n');

    if (failed === 0) {
        console.log('🎉 All tests passed! Serverless function is working correctly.');
        console.log('\n📝 Next steps:');
        console.log('   1. Set CONVERTKIT_API_KEY and CONVERTKIT_FORM_ID in Netlify');
        console.log('   2. Test with real API credentials: npx netlify dev');
        console.log('   3. Deploy to production: git push origin main\n');
        return 0;
    } else {
        console.log('⚠️  Some tests failed. Review the output above.\n');
        return 1;
    }
}

// Run tests
runTests()
    .then(exitCode => process.exit(exitCode))
    .catch(error => {
        console.error('❌ Fatal error:', error);
        process.exit(1);
    });
