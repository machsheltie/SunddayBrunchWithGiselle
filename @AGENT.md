# Agent Build Instructions - Sunday Brunch with Giselle

## Project Information
- **Name:** Sunday Brunch with Giselle
- **Type:** Full-stack recipe website (React + Supabase)
- **Current Sprint:** Sprint 4 Week 1 - Authentication & Backend Setup
- **Tests:** 603 passing (97.02% coverage)
- **Methodology:** Test-Driven Development (TDD)

## Project Setup
```bash
# Install dependencies
cd sunday-brunch-website
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials:
#   VITE_SUPABASE_URL=https://yoyyojzywqnkxgfzfxic.supabase.co
#   VITE_SUPABASE_ANON_KEY=your-key-here
```

## Running Tests
```bash
# Navigate to the website directory first
cd sunday-brunch-website

# Run all tests (603 tests)
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- SearchBar.test

# Run tests matching pattern
npm test -- authentication
```

## Build Commands
```bash
# Navigate to website directory
cd sunday-brunch-website

# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Development Server
```bash
# Start development server (Vite)
cd sunday-brunch-website
npm run dev

# Server will start at http://localhost:5173
```

## Supabase Commands
```bash
# Run SQL scripts (from project root)
# Option 1: Via Supabase Dashboard (UI method - recommended)
# 1. Go to https://supabase.com/dashboard/project/yoyyojzywqnkxgfzfxic/editor
# 2. Click "SQL Editor"
# 3. Paste contents of supabase_sprint4_setup.sql
# 4. Click "Run"

# Option 2: Via Supabase CLI (if installed)
supabase db push

# Check Supabase status
supabase status
```

## Key Learnings

### Testing Best Practices
- **Write tests first (TDD)** - Prevents bugs before they happen
- **Use waitFor() for async operations** - Critical for React Query + Supabase
- **Mock Supabase client** - Tests should not hit real database
- **Test accessibility** - Use screen reader queries (getByRole, getByLabelText)
- **Current coverage:** 97.02% with 603 passing tests ✅

### Build Optimizations
- **Code splitting:** 8 lazy-loaded pages (React.lazy + Suspense)
- **Tree-shaking:** Three.js named imports, PropTypes removal in prod
- **Image optimization:** WebP conversion plan (2.5-3.5 MB savings)
- **Bundle size:** Initial load ~1.0-1.1MB (optimized with vendor chunking)

### Authentication Flow
```javascript
// 1. User signs up
await supabase.auth.signUp({ email, password })

// 2. User signs in
await supabase.auth.signInWithPassword({ email, password })

// 3. Get current session
const { data: { session } } = await supabase.auth.getSession()

// 4. Sign out
await supabase.auth.signOut()
```

### Important Paths
- **Source Code:** `sunday-brunch-website/src/`
- **Tests:** `sunday-brunch-website/src/tests/`
- **Auth Components:** `sunday-brunch-website/src/components/auth/`
- **Supabase Config:** `sunday-brunch-website/src/config/supabaseClient.js`
- **Environment:** `sunday-brunch-website/.env.local`

### Gotchas
- ⚠️ `.env.local` must be in `sunday-brunch-website/` directory (NOT project root)
- ⚠️ Vite requires `VITE_` prefix for env variables
- ⚠️ Web Vitals v3+ uses `onINP` instead of deprecated `onFID`
- ⚠️ Always check authentication state before rendering protected content
- ⚠️ Never remove or simplify animations (Three.js, GSAP, Framer Motion)

### Fastest Test/Build Cycle
```bash
# Terminal 1: Watch tests (instant feedback)
cd sunday-brunch-website && npm test -- --watch

# Terminal 2: Dev server (hot reload)
cd sunday-brunch-website && npm run dev

# Terminal 3: Type checking (optional)
cd sunday-brunch-website && npm run type-check -- --watch
```

## Feature Development Quality Standards

**CRITICAL**: All new features MUST meet the following mandatory requirements before being considered complete.

### Testing Requirements

- **Minimum Coverage**: 95% code coverage required (current: 97.02%)
- **Test Pass Rate**: 100% - all tests must pass, no exceptions (current: 603/603)
- **Test Types Required**:
  - Unit tests for all components and hooks
  - Integration tests for auth flows and API interactions
  - Accessibility tests (WCAG 2.1 AA compliance)
- **Coverage Validation**:
  ```bash
  npm run test:coverage
  ```
- **Test Quality**: Tests must validate behavior, not just achieve coverage metrics
- **Test Documentation**: Complex test scenarios must include comments explaining the test strategy

### Git Workflow Requirements

Before moving to the next feature, ALL changes must be:

1. **Committed with Clear Messages**:
   ```bash
   git add .
   git commit -m "feat(auth): add protected route component with redirect logic"
   ```
   - Use conventional commit format: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, etc.
   - Include scope when applicable: `feat(auth):`, `fix(ui):`, `test(ratings):`
   - Write descriptive messages that explain WHAT changed and WHY
   - Include "Co-Authored-By: Claude <noreply@anthropic.com>" footer

2. **Pushed to Remote Repository**:
   ```bash
   git push origin main
   ```
   - Never leave completed features uncommitted
   - Push regularly to maintain backup and enable collaboration
   - Ensure CI/CD pipelines pass (if configured)

3. **Branch Hygiene**:
   - Work on feature branches when appropriate
   - Branch naming convention: `feature/protected-routes`, `fix/auth-redirect`
   - Create pull requests for significant changes (if working with a team)

4. **Ralph Integration**:
   - Update @fix_plan.md with new tasks before starting work
   - Mark items complete in @fix_plan.md upon completion
   - Update PROMPT.md if development patterns change
   - Update @AGENT.md with new build/test insights

### Documentation Requirements

**ALL implementation documentation MUST remain synchronized with the codebase**:

1. **Code Documentation**:
   - JSDoc comments for all exported components and functions
   - Update inline comments when implementation changes
   - Remove outdated comments immediately

2. **Implementation Documentation**:
   - Update relevant sections in this @AGENT.md file
   - Keep build and test commands current
   - Update configuration examples when defaults change
   - Document breaking changes prominently

3. **README Updates**:
   - Keep feature lists current in main README.md
   - Update setup instructions when dependencies change
   - Maintain accurate command examples
   - Update version compatibility information

4. **@AGENT.md Maintenance**:
   - Add new build patterns to relevant sections
   - Update "Key Learnings" with new insights
   - Keep command examples accurate and tested
   - Document new testing patterns or quality gates

### Feature Completion Checklist

Before marking ANY feature as complete, verify:

- [ ] All tests pass (603+ tests with 100% pass rate)
- [ ] Code coverage meets 95% minimum threshold (currently 97.02%)
- [ ] Coverage report reviewed for meaningful test quality
- [ ] Code formatted according to project standards
- [ ] Type checking passes (if using TypeScript)
- [ ] All changes committed with conventional commit messages
- [ ] All commits pushed to remote repository
- [ ] @fix_plan.md task marked as complete
- [ ] Implementation documentation updated
- [ ] Inline code comments updated or added
- [ ] @AGENT.md updated (if new patterns introduced)
- [ ] Breaking changes documented
- [ ] Features tested in development server
- [ ] Accessibility verified (keyboard navigation, screen readers)
- [ ] Animation/visual magic preserved (Three.js, GSAP, Framer Motion)

### Rationale

These standards ensure:
- **Quality**: High test coverage and pass rates prevent regressions
- **Traceability**: Git commits and @fix_plan.md provide clear history of changes
- **Maintainability**: Current documentation reduces onboarding time and prevents knowledge loss
- **Collaboration**: Pushed changes enable team visibility and code review
- **Reliability**: Consistent quality gates maintain production stability
- **Automation**: Ralph integration ensures continuous development practices

**Enforcement**: AI agents should automatically apply these standards to all feature development tasks without requiring explicit instruction for each task.

## Recent Wins

### Sprint 3 Achievements
- ✅ **97.02% test coverage** (603 tests passing)
- ✅ Security hardened (ConvertKit API key in serverless function)
- ✅ Code splitting implemented (8 pages lazy-loaded)
- ✅ Tree-shaking optimization (Three.js, PropTypes)
- ✅ Web Vitals monitoring integrated
- ✅ Accessibility guide created (WCAG 2.1 AA)

### Sprint 4 Week 1 Progress
- ✅ Supabase project configured
- ✅ Authentication UI complete (LoginForm, SignUpForm, ForgotPasswordForm, UserMenu)
- ✅ Authentication context (AuthContext, useAuth hook)
- ✅ Sign In button in Layout
- ✅ Bug fixes (webVitals onFID→onINP, env variable loading)
- ✅ Design improvements (pastel-lavender gradients)
- ✅ 12 commits pushed to GitHub

### Next Priority
- Database setup (Supabase SQL scripts)
- Protected routes (ProtectedRoute component)
- Authentication tests (50+ tests, bring total to 653+)
- E2E authentication flow testing

---

**Last Updated:** 2026-01-13
**Project Status:** Sprint 4 Week 1 (80% complete)
**Next Sprint:** Sprint 4 Week 2 (Ratings System)
