# Fix Failing Tests Skill

**Skill Name:** `fix-failing-tests`
**Purpose:** Automatically debug and fix failing tests using specialized debugging agents
**Target:** Achieve 100% test pass rate

## When to Use

Use this skill automatically whenever:
- Test suite shows <100% pass rate
- IMPLEMENTATION_SUMMARY.md reports failing tests (⚠️ indicators)
- CI/CD pipeline reports test failures
- New features have failing tests
- Regression detected (previously passing tests now fail)

**Use PROACTIVELY** - Don't wait for user to request fixes.

## Instructions

When invoked, you MUST follow these steps in order:

### Step 1: Identify Failing Tests

1. **Run the test suite:**
   ```bash
   npm test
   ```

2. **Analyze test output:**
   - Count total failing tests
   - Identify which test files are failing
   - Group failures by category:
     - Component rendering issues
     - State management issues
     - API/integration issues
     - Timing/async issues
     - Mock/setup issues
     - Type/validation issues

3. **Read failing test files:**
   - Use Read tool to examine each failing test file
   - Understand what the test expects
   - Identify the actual error messages

### Step 2: Select Appropriate Debugging Agent

Based on failure type, use the correct agent:

#### **Component Rendering Issues**
- **Symptoms:** "Unable to find element", "Component not rendering", "Props not passed"
- **Agent:** `debugging-toolkit:debugger`
- **Action:** Fix component rendering logic, prop passing, conditional rendering

#### **State Management Issues**
- **Symptoms:** "State not updating", "Redux store not reflecting changes", "Hooks not working"
- **Agent:** `debugging-toolkit:debugger`
- **Action:** Fix state updates, Redux actions/reducers, hook dependencies

#### **API/Integration Issues**
- **Symptoms:** "API call failed", "Network error", "Mock not working", "Async timeout"
- **Agent:** `error-debugging:error-detective`
- **Action:** Fix API mocks, network interceptors, response handling

#### **Timing/Async Issues**
- **Symptoms:** "Timeout exceeded", "waitFor timed out", "Element not found in time"
- **Agent:** `debugging-toolkit:debugger`
- **Action:** Add waitFor, increase timeouts, fix async handling

#### **Mock/Setup Issues**
- **Symptoms:** "Module not mocked", "Function not defined", "Spy not working"
- **Agent:** `debugging-toolkit:debugger`
- **Action:** Fix mock setup, jest.fn() calls, module mocking

#### **Type/Validation Issues**
- **Symptoms:** "TypeScript error in test", "Type mismatch", "Validation failed"
- **Agent:** `javascript-typescript:typescript-pro`
- **Action:** Fix type annotations, test data structures, validation logic

#### **Complex Multi-Issue Failures**
- **Symptoms:** Multiple unrelated test failures, cascade failures, integration failures
- **Agent:** `error-debugging:error-detective`
- **Action:** Investigate root cause, fix underlying issues affecting multiple tests

### Step 3: Create Todo List

Create a comprehensive todo list for fixing ALL failing tests:

```javascript
TodoWrite({
  todos: [
    {
      content: "Fix component rendering tests (SearchBar.test.jsx - 2 failures)",
      activeForm: "Fixing component rendering tests",
      status: "pending"
    },
    {
      content: "Fix async/timing issues (useRecipeSearch.test.js - 3 failures)",
      activeForm: "Fixing async/timing issues",
      status: "pending"
    },
    // ... one todo per category of failures
  ]
})
```

### Step 4: Launch Debugging Agent

For each category of failures, launch the appropriate agent:

```javascript
Task({
  subagent_type: "debugging-toolkit:debugger", // or appropriate agent
  description: "Fix component rendering tests",
  prompt: `Fix the failing tests in SearchBar.test.jsx.

Failing tests:
1. "should update search query on input change" - Element not found
2. "should call onSearch when form submitted" - onSearch not called

Test file location: sunday-brunch-website/src/tests/components/SearchBar.test.jsx
Component location: sunday-brunch-website/src/components/search/SearchBar.jsx

Steps:
1. Read both files to understand the issue
2. Identify why tests are failing
3. Fix the component or test code
4. Verify tests pass by running npm test -- SearchBar.test.jsx
5. Mark todo as completed

Target: 100% test pass rate
DO NOT proceed until ALL tests in this file pass.`
})
```

### Step 5: Verify Fixes

After each agent completes:

1. **Run specific test file:**
   ```bash
   npm test -- <test-file-name>
   ```

2. **Verify 100% pass rate for that file**

3. **Mark todo as completed**

4. **Move to next failing test category**

### Step 6: Run Full Test Suite

After all individual fixes:

```bash
npm test
```

**Expected Result:** 100% test pass rate

**If any tests still fail:** Repeat Steps 2-5 for remaining failures

### Step 7: Update Documentation

Once all tests pass:

1. **Update IMPLEMENTATION_SUMMARY.md:**
   - Change ⚠️ to ✅ for fixed components
   - Update pass rate to 100%
   - Remove "Known Issues" section if all issues resolved

2. **Update IMPLEMENTATION_ROADMAP.md:**
   - Check off "Fix failing tests" task
   - Update test metrics

### Step 8: Commit Changes

```bash
git add .
git commit -m "$(cat <<'EOF'
test: fix all failing tests to achieve 100% pass rate

## Test Fixes Complete

### Tests Fixed
- [x] SearchBar tests (2 failures → 0)
- [x] RecipeFilters tests (3 failures → 0)
- [x] useRecipeSearch tests (2 failures → 0)
- [x] SearchResults tests (1 failure → 0)

### Categories Fixed
- Component rendering issues (4 tests)
- Async/timing issues (2 tests)
- Mock setup issues (2 tests)

### Results
- **Before:** 53/59 passing (89.8%)
- **After:** 59/59 passing (100%)
- **Test Execution Time:** 3.28s

### Changes Made
- Fixed waitFor usage in async tests
- Corrected mock function setup
- Updated component prop passing
- Fixed state update timing issues

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### Step 9: Push to GitHub

```bash
git push origin main
```

### Step 10: Inform User

Provide comprehensive summary:

```
✅ Fixed all failing tests - 100% pass rate achieved!

## Summary
- **Before:** 53/59 passing (89.8%)
- **After:** 59/59 passing (100%)
- **Tests Fixed:** 6
- **Time:** 3.28s

## Categories Fixed
- Component rendering: 2 tests
- Async/timing: 2 tests
- Mock setup: 2 tests

## Updated Files
- SearchBar.test.jsx
- RecipeFilters.test.jsx
- useRecipeSearch.test.js
- SearchResults.test.jsx

## Documentation Updated
- ✅ IMPLEMENTATION_SUMMARY.md (all ⚠️ → ✅)
- ✅ IMPLEMENTATION_ROADMAP.md (test task checked off)

All changes committed and pushed to GitHub.
```

## Agent Selection Reference

| Failure Type | Symptoms | Agent to Use |
|--------------|----------|--------------|
| **Rendering** | Element not found, component not rendering | `debugging-toolkit:debugger` |
| **State** | State not updating, Redux issues | `debugging-toolkit:debugger` |
| **API** | Network errors, mock failures | `error-debugging:error-detective` |
| **Async** | Timeouts, waitFor failures | `debugging-toolkit:debugger` |
| **Mocks** | Module not mocked, spy issues | `debugging-toolkit:debugger` |
| **Types** | TypeScript errors, type mismatches | `javascript-typescript:typescript-pro` |
| **Complex** | Multiple unrelated failures | `error-debugging:error-detective` |

## Important Notes

- **ALWAYS aim for 100% test pass rate**
- **Fix tests in logical groups** (by file or category)
- **Verify each fix** before moving to next
- **Update documentation** after all fixes
- **Commit with detailed message** about what was fixed
- **Use appropriate agent** for each failure type
- **Mark todos as completed** as you progress
- **Don't skip verification steps**

## Error Handling

If agent fails to fix tests:
- ❌ Tests still failing → Try different agent
- ❌ Can't identify root cause → Use `error-debugging:error-detective`
- ❌ TypeScript errors blocking tests → Use `javascript-typescript:typescript-pro` first
- ❌ Multiple cascade failures → Fix root cause first, then re-run tests
- ❌ Test file not found → Verify correct path, use Glob to find files

## Success Criteria

A successful fix includes:
- ✅ 100% test pass rate achieved
- ✅ All test files passing individually
- ✅ Full test suite passing
- ✅ Documentation updated (IMPLEMENTATION_SUMMARY.md)
- ✅ Changes committed with detailed message
- ✅ Pushed to GitHub
- ✅ User informed with comprehensive summary

## Example Invocation

**Scenario:** IMPLEMENTATION_SUMMARY.md shows 53/59 tests passing (89.8%)

**You do:**
1. ✅ Run npm test to see failures
2. ✅ Identify 6 failing tests across 4 files
3. ✅ Group by category:
   - Rendering: 2 tests
   - Async: 2 tests
   - Mocks: 2 tests
4. ✅ Create todo list with 3 items
5. ✅ Launch `debugging-toolkit:debugger` for rendering issues
6. ✅ Fix 2 rendering tests, verify passing
7. ✅ Launch `debugging-toolkit:debugger` for async issues
8. ✅ Fix 2 async tests, verify passing
9. ✅ Launch `debugging-toolkit:debugger` for mock issues
10. ✅ Fix 2 mock tests, verify passing
11. ✅ Run full test suite → 59/59 passing (100%)
12. ✅ Update IMPLEMENTATION_SUMMARY.md
13. ✅ Commit and push
14. ✅ Inform user: "100% test pass rate achieved!"

## Coordination with Other Skills

**Before using `complete-phase` skill:**
- Run `fix-failing-tests` first to achieve 100% pass rate
- Only mark phases complete when all tests pass

**Before using `update-summary` skill:**
- Run `fix-failing-tests` first
- Summary should reflect 100% pass rates

**Execution Order for Phase Completion:**
1. First: `fix-failing-tests` (if needed)
2. Second: `update-summary`
3. Third: `complete-phase`
