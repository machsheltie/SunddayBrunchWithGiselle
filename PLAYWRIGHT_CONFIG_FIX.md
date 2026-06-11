# Playwright Configuration Fix - 2026-01-20

## ✅ ISSUE RESOLVED

Playwright E2E tests were timing out with the error:
```
Error: Timed out waiting 120000ms from config.webServer.
```

---

## 🔍 Root Cause

**Port Mismatch:**
- **Dev Server (package.json):** Configured to run on port `5178`
  ```json
  "dev": "vite --port 5178"
  ```

- **Playwright Config:** Expected dev server on port `5173`
  ```javascript
  baseURL: 'http://localhost:5173'
  webServer: {
    url: 'http://localhost:5173'
  }
  ```

**Why This Caused Timeout:**
Playwright's `webServer` option automatically starts the dev server and waits for it to be ready by polling the configured URL. Since the server was actually running on port 5178 but Playwright was checking port 5173, it never detected the server as "ready" and timed out after 120 seconds.

---

## 🔧 Fix Applied

Updated `playwright.config.js` to use the correct port `5178` in **two locations**:

### 1. Base URL (line 29)
```diff
  use: {
-   baseURL: 'http://localhost:5173',
+   baseURL: 'http://localhost:5178',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    viewport: { width: 1280, height: 720 },
  },
```

### 2. WebServer URL (line 75)
```diff
  webServer: {
    command: 'npm run dev',
-   url: 'http://localhost:5173',
+   url: 'http://localhost:5178',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
```

---

## ✅ Verification

### E2E Test Results (After Fix)

```bash
Running 36 tests using 4 workers

✓ 36 passed (45.2s)
```

**All Test Suites Passing:**
- ✅ Authentication Flow: 10/10 tests
- ✅ Navigation: 10/10 tests
- ✅ Newsletter Signup: 9/9 tests
- ✅ Home Page: 7/7 tests

**Test Execution:**
- **Before:** Timeout after 120 seconds
- **After:** 45.2 seconds (all tests passing)

---

## 📊 Impact

### Before Fix
- ❌ E2E tests unusable (timeout error)
- ⚠️ Manual server startup required
- ⚠️ Inconsistent test environment

### After Fix
- ✅ E2E tests run automatically
- ✅ Dev server auto-starts on correct port
- ✅ Consistent test environment
- ✅ CI/CD ready (with reuseExistingServer flag)

---

## 🎯 Key Learnings

### 1. Port Configuration Consistency
Always ensure port numbers match across:
- `package.json` dev scripts
- Playwright `baseURL`
- Playwright `webServer.url`
- Any other test configuration files

### 2. Playwright webServer Behavior
- `command`: Starts the dev server
- `url`: Polls this URL to check if server is ready
- `reuseExistingServer`: Reuses already-running server (useful for local development)
- `timeout`: Maximum time to wait for server to be ready (default: 120s)

### 3. Debugging Timeout Issues
When Playwright times out waiting for webServer:
1. Check if ports match between server config and Playwright config
2. Manually start the server and verify which port it uses
3. Use `netstat` or similar to confirm port availability
4. Check server startup logs for errors

---

## 🔍 How to Prevent in Future

### Best Practice: Centralize Port Configuration

Create a shared config file:

**`config.js`**
```javascript
export const DEV_SERVER_PORT = 5178
export const DEV_SERVER_URL = `http://localhost:${DEV_SERVER_PORT}`
```

**`package.json`**
```json
{
  "scripts": {
    "dev": "vite --port 5178"
  }
}
```

**`playwright.config.js`**
```javascript
import { DEV_SERVER_URL } from './config.js'

export default defineConfig({
  use: {
    baseURL: DEV_SERVER_URL,
  },
  webServer: {
    url: DEV_SERVER_URL,
  },
})
```

This approach:
- ✅ Single source of truth for port number
- ✅ No risk of mismatch
- ✅ Easier to change ports in future
- ✅ Self-documenting

---

## 📝 Testing Commands

```bash
# Run all E2E tests (auto-starts dev server)
npm run test:e2e

# Run specific test file
npx playwright test e2e/home.spec.js

# Run with UI mode (interactive)
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# View last test report
npm run test:e2e:report
```

---

## 🎉 Summary

**Issue:** Playwright timeout due to port mismatch (5173 vs 5178)

**Fix:** Updated `playwright.config.js` to use correct port 5178

**Result:** All 36 E2E tests now passing in 45.2 seconds

**File Changed:**
- `sunday-brunch-website/playwright.config.js` (2 lines changed)

---

**Fixed:** 2026-01-20
**Time to Fix:** 15 minutes
**Impact:** High (enabled full E2E test suite)
**Status:** RESOLVED ✅
