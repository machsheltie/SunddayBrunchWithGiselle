# Ralph Fix Plan - Sunday Brunch with Giselle

## 🎯 Sprint 4 Week 1: Authentication & Backend Setup (IN PROGRESS)

### High Priority (Complete This Week)

#### 1. Complete Database Setup (CRITICAL)
- [x] Run Supabase SQL scripts (supabase_sprint4_setup.sql)
  - Create users table (profiles, display_name, avatar_url)
  - Create recipes table (if not exists)
  - Create ratings table (user_id, recipe_id, rating, created_at)
  - Create reviews table (user_id, recipe_id, content, images, created_at)
  - Create review_votes table (user_id, review_id, vote_type)
- [x] Set up Row Level Security (RLS) policies for all tables
- [x] Test database access from frontend (verify Supabase client connection)
- [x] Verify Supabase Auth integration with database

**Why Critical:** Backend database required before writing comprehensive tests
**Estimated Time:** 2-3 hours

#### 2. Implement Protected Routes (HIGH PRIORITY)
- [ ] Create ProtectedRoute component
  - Check authentication status via useAuth()
  - Redirect to login if not authenticated
  - Show loading state while checking auth
- [ ] Wrap protected pages (Profile, MyRecipes, etc.)
- [ ] Handle auth state changes (sign in/out navigation)
- [ ] Test navigation flows:
  - Unauthenticated user tries to access protected page
  - User signs in and returns to intended page
  - User signs out and redirects to home

**Why Important:** Core security feature for user-specific content
**Estimated Time:** 2-3 hours

#### 3. Write Comprehensive Authentication Tests (HIGH PRIORITY)
**Target:** 50+ tests for authentication (bring total from 603 to 653+)

- [ ] **AuthContext tests (15-20 tests)**
  - Initial state (not authenticated)
  - Sign in success/error flows
  - Sign up success/error flows
  - Sign out flow
  - Password reset flow
  - Auth state persistence

- [ ] **LoginForm tests (10-12 tests)**
  - Render and initial state
  - Form validation (empty fields, invalid email)
  - Successful login
  - Failed login (wrong credentials)
  - Loading states
  - Switch to sign up/forgot password

- [ ] **SignUpForm tests (10-12 tests)**
  - Render and initial state
  - Form validation (password mismatch, weak password)
  - Successful registration
  - Failed registration (email already exists)
  - Loading states
  - Switch to login

- [ ] **ForgotPasswordForm tests (8-10 tests)**
  - Render and initial state
  - Form validation
  - Successful password reset
  - Failed password reset
  - Success state display
  - Back to login

- [ ] **UserMenu tests (8-10 tests)**
  - Render with user data
  - Display name and email
  - Dropdown open/close
  - Click outside to close
  - Sign out functionality

- [ ] **ProtectedRoute tests (5-8 tests)**
  - Redirect when not authenticated
  - Allow access when authenticated
  - Loading state
  - Navigation after sign in/out

**Why Important:** Tests provide confidence for future changes and prevent regressions
**Estimated Time:** 4-6 hours

#### 4. End-to-End Authentication Testing (MEDIUM PRIORITY)
- [ ] Test sign up flow (new user)
  - Fill in form, submit
  - Verify email sent (check Supabase dashboard)
  - Verify user created in database
  - Verify user logged in automatically

- [ ] Test sign in flow (existing user)
  - Fill in form, submit
  - Verify user logged in
  - Verify UserMenu appears
  - Verify protected routes accessible

- [ ] Test sign out flow
  - Click sign out in UserMenu
  - Verify user logged out
  - Verify redirected to home
  - Verify protected routes inaccessible

- [ ] Test forgot password flow
  - Fill in form, submit
  - Verify email sent (check Supabase dashboard)
  - Verify success message displayed

- [ ] Test error scenarios
  - Wrong password
  - Email not found
  - Email already exists
  - Network error

**Why Important:** Validates entire authentication system works as expected
**Estimated Time:** 2-3 hours

---

## Medium Priority (Next Sprint - Week 2)

### Sprint 4 Week 2: Ratings System
- [ ] Design ratings database schema (Supabase)
  - ratings table (user_id, recipe_id, rating 1-5, created_at)
  - Add RLS policies (users can only rate once per recipe)
- [ ] Create StarRating component
  - Interactive star display (1-5 stars)
  - Click to rate
  - Display average rating
  - Accessibility (keyboard navigation, ARIA labels)
- [ ] Implement rating submission API
  - POST /ratings endpoint (or Supabase client call)
  - Validate user authenticated
  - Validate rating value (1-5)
  - Update or insert rating
- [ ] Add rating aggregation
  - Calculate average rating per recipe
  - Count total ratings
  - Update recipe data with aggregated values
- [ ] Display average ratings on recipe cards
  - Show star display (e.g., 4.5 stars)
  - Show rating count (e.g., "128 ratings")
  - Update RecipeCard component
  - Update FeaturedRecipeCard component
- [ ] Write 40+ ratings tests
  - StarRating component tests
  - Rating submission tests
  - Rating aggregation tests
  - Display tests

**Why Important:** Core feature for user engagement and recipe discovery
**Estimated Time:** 1 week

---

## Low Priority (Sprints 3-4)

### Sprint 4 Week 3: Reviews System
- [ ] Design reviews database schema
- [ ] Build reviews backend API
- [ ] Create ReviewForm component
- [ ] Build ReviewList component
- [ ] Add review filtering/sorting
- [ ] Implement review moderation
- [ ] Write 50+ reviews tests

### Sprint 4 Week 4: Images, Polish & Deployment
- [ ] User-uploaded review images (Supabase Storage)
- [ ] Image optimization and thumbnails
- [ ] Final accessibility audit
- [ ] Performance regression testing
- [ ] Deploy to production
- [ ] Post-launch monitoring

---

## Completed ✅

### Sprint 4 Week 1 Progress
- [x] Set up Supabase project (https://yoyyojzywqnkxgfzfxic.supabase.co)
- [x] Configure Supabase Auth (email/password)
- [x] Create authentication UI components (LoginForm, SignUpForm, ForgotPasswordForm, AuthModal, UserMenu)
- [x] Create authentication context (AuthContext.jsx) and hooks (useAuth.js)
- [x] Integrate authentication into Layout (Sign In button in upper right corner)
- [x] User profile management (UserMenu dropdown with avatar, display name, sign out)
- [x] Fix webVitals error (onFID → onINP migration)
- [x] Fix Supabase environment variables (.env.local in correct location)
- [x] Update form backgrounds to pastel-lavender gradient
- [x] 12 commits pushed to GitHub

### Sprint 3: Security & Performance Hardening (COMPLETE)
- [x] Security fixes (ConvertKit API key moved to serverless function)
- [x] Code splitting (8 pages lazy-loaded, WhimsicalLoader component)
- [x] Tree-shaking optimization (Three.js named imports, PropTypes removal)
- [x] Image optimization plan created (WebP conversion strategy)
- [x] Test coverage: 97.02% with 603 passing tests ✅
- [x] Performance monitoring (Web Vitals, Lighthouse CI)
- [x] Accessibility guide (WCAG 2.1 AA compliance)

### Sprint 2: Nutritional Information (COMPLETE)
- [x] NutritionFacts component (FDA 2016 compliant)
- [x] DietaryBadges component (12 dietary types)
- [x] AllergenWarnings component (FDA Big 8 + Sesame)
- [x] 90 nutrition tests, 100% coverage

### Sprint 1: Advanced Search & Discovery (COMPLETE)
- [x] SearchBar component with fuzzy search (Fuse.js)
- [x] RecipeFilters component (7 filter categories, 40+ options)
- [x] SearchResults component with grid layout
- [x] useRecipeSearch custom hook
- [x] 59 comprehensive tests (100% pass rate)

---

## Notes

### Current Status (2026-01-13)
- **Total Tests:** 603 passing (100% pass rate)
- **Test Coverage:** 97.02% (exceeding 95% target)
- **Sprint 4 Week 1:** ~80% complete (UI done, tests needed)
- **Next Priority:** Database setup → Protected routes → Authentication tests

### Technical Debt
**None identified** ✅ - All code follows best practices

### Design Philosophy Reminder
- ✅ KEEP: Three.js watercolor backgrounds, GSAP animations, Framer Motion
- ✅ KEEP: All whimsical flourishes and interactive effects
- ❌ NEVER remove animations for "performance" or "load time"

### Testing Philosophy
- Limit testing to ~20% of effort per loop
- Write tests for NEW functionality only
- Don't refactor existing tests unless broken
- Focus on implementation first, comprehensive testing later
- Target: 95%+ coverage (currently at 97.02%)

---

**Last Updated:** 2026-01-13
**Current Sprint:** Sprint 4 Week 1 (Authentication & Backend Setup)
**Next Review:** After database setup complete
