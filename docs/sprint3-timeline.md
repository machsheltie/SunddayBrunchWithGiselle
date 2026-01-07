# Sprint 3: Visual Timeline & Daily Breakdown

**Duration:** 20 working days (4 weeks)
**Approach:** Test-Driven Development (TDD)
**Target:** 150+ tests, 85%+ coverage

---

## Weekly Overview

```
Week 1: Authentication           [████████████░░░░░░░░] 40% complexity
Week 2: Ratings System           [████████░░░░░░░░░░░░] 30% complexity
Week 3: Reviews System           [████████████████░░░░] 70% complexity
Week 4: Images + Polish          [████████░░░░░░░░░░░░] 30% complexity
```

---

## Week 1: Authentication Foundation

### Monday (Day 1)
**Focus:** Supabase Setup
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create Supabase project (`sunday-brunch-reviews`)
- [ ] Configure authentication providers (email/password)
- [ ] Set up environment variables (.env)
- [ ] Install Supabase client (`npm install @supabase/supabase-js`)

**Afternoon (3h):**
- [ ] Create database schema (profiles table)
- [ ] Write RLS policies for profiles
- [ ] Create Storage bucket (review-images)
- [ ] Test: Create user in Dashboard
- [ ] Test: Verify RLS policies

**Deliverable:**
✅ Supabase project live and configured

---

### Tuesday (Day 2)
**Focus:** Auth Context & Login Form
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/lib/supabase.ts` (Supabase client)
- [ ] Create `src/context/AuthContext.jsx` (5 tests)
- [ ] Write tests for AuthContext
- [ ] Implement AuthContext (session management)

**Afternoon (4h):**
- [ ] Create `src/services/auth.service.ts` (10 tests)
- [ ] Create `src/components/auth/LoginForm.jsx` (15 tests)
- [ ] Write LoginForm tests (RED phase)
- [ ] Implement LoginForm (GREEN phase)
- [ ] Test: Can login with valid credentials

**Deliverable:**
✅ Login form functional
✅ 30 tests passing

---

### Wednesday (Day 3)
**Focus:** Register Form & Auth Modal
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/components/auth/RegisterForm.jsx` (15 tests)
- [ ] Write RegisterForm tests (RED phase)
- [ ] Implement RegisterForm (GREEN phase)
- [ ] Add username validation

**Afternoon (4h):**
- [ ] Create `src/components/auth/AuthModal.jsx` (5 tests)
- [ ] Create `src/components/auth/UserMenu.jsx` (5 tests)
- [ ] Add session persistence
- [ ] Test: Sign up creates user + profile

**Deliverable:**
✅ Registration functional
✅ 60 tests passing

---

### Thursday (Day 4)
**Focus:** Protected Routes & Navigation
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/components/auth/ProtectedRoute.jsx` (10 tests)
- [ ] Write protected route tests
- [ ] Implement route guards
- [ ] Add redirect logic (preserve destination)

**Afternoon (4h):**
- [ ] Integrate auth into existing components
- [ ] Add "Sign in to rate" prompts
- [ ] Test unauthorized access scenarios
- [ ] Add loading states

**Deliverable:**
✅ Protected routes working
✅ 70 tests passing

---

### Friday (Day 5)
**Focus:** Testing & Bug Fixes
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Write integration tests (auth flow)
- [ ] Test error scenarios (invalid email, network errors)
- [ ] Add loading skeletons
- [ ] Accessibility audit (forms)

**Afternoon (4h):**
- [ ] Fix any bugs discovered
- [ ] Refactor code (DRY, clean-up)
- [ ] Update documentation
- [ ] Code review

**Deliverable:**
✅ 80+ auth tests passing
✅ Zero critical bugs
✅ Week 1 complete

---

## Week 2: Ratings System

### Monday (Day 6)
**Focus:** Rating Backend Integration
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `recipe_ratings` table in Supabase
- [ ] Create `recipe_rating_stats` view
- [ ] Write RLS policies for ratings
- [ ] Test RLS (one rating per user per recipe)

**Afternoon (4h):**
- [ ] Create `src/services/rating.service.ts` (10 tests)
- [ ] Write rating service tests (RED phase)
- [ ] Implement rating service (GREEN phase)
- [ ] Test: Can rate recipe

**Deliverable:**
✅ Rating backend functional
✅ 90 tests passing

---

### Tuesday (Day 7)
**Focus:** Star Rating Component
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/hooks/useRating.js` (5 tests)
- [ ] Create `src/components/ratings/StarRating.jsx` (15 tests)
- [ ] Write StarRating tests (RED phase)
- [ ] Implement StarRating (GREEN phase)

**Afternoon (4h):**
- [ ] Add hover effects
- [ ] Add keyboard navigation (arrow keys)
- [ ] Test accessibility (screen reader)
- [ ] Responsive design (mobile touch)

**Deliverable:**
✅ Star rating component functional
✅ 110 tests passing

---

### Wednesday (Day 8)
**Focus:** Rating Stats & Display
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/components/ratings/RatingDisplay.jsx` (5 tests)
- [ ] Create `src/components/ratings/RatingStats.jsx` (15 tests)
- [ ] Write RatingStats tests (RED phase)
- [ ] Implement RatingStats (GREEN phase)

**Afternoon (4h):**
- [ ] Add rating breakdown histogram
- [ ] Add percentage calculations
- [ ] Test edge case: no ratings yet
- [ ] Styling + responsive design

**Deliverable:**
✅ Rating stats display
✅ 130 tests passing

---

### Thursday (Day 9)
**Focus:** Real-time Updates + Optimistic UI
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Set up Supabase real-time subscriptions
- [ ] Add real-time listener to rating service
- [ ] Test: Multiple users see same data
- [ ] Test: Subscription cleanup

**Afternoon (4h):**
- [ ] Implement optimistic updates (instant feedback)
- [ ] Add loading states
- [ ] Add error recovery
- [ ] Test offline scenarios

**Deliverable:**
✅ Real-time ratings working
✅ 140 tests passing

---

### Friday (Day 10)
**Focus:** Integration + Testing
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Enhance RecipeCard with ratings
- [ ] Create `src/components/ratings/RateRecipeButton.jsx` (5 tests)
- [ ] Integration test: Rate recipe → Stats update
- [ ] Test concurrent ratings (race conditions)

**Afternoon (4h):**
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Bug fixes
- [ ] Refactoring

**Deliverable:**
✅ 150+ rating tests passing
✅ Week 2 complete

---

## Week 3: Reviews System

### Monday (Day 11)
**Focus:** Review Schema + Service
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `recipe_reviews` table in Supabase
- [ ] Create `review_votes` table
- [ ] Write RLS policies for reviews
- [ ] Add helpful count triggers

**Afternoon (4h):**
- [ ] Create `src/services/review.service.ts` (15 tests)
- [ ] Write review service tests (RED phase)
- [ ] Implement review service (GREEN phase)
- [ ] Test: Create review (pending approval)

**Deliverable:**
✅ Review backend functional
✅ 165 tests passing

---

### Tuesday (Day 12)
**Focus:** Review Form Component
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/hooks/useReviews.js` (5 tests)
- [ ] Create `src/components/reviews/ReviewForm.jsx` (20 tests)
- [ ] Write ReviewForm tests (RED phase)
- [ ] Implement ReviewForm (GREEN phase)

**Afternoon (4h):**
- [ ] Add form validation (rating, content length)
- [ ] Add character counter
- [ ] Add checkboxes (modifications, would make again)
- [ ] Test: Auth required to submit

**Deliverable:**
✅ Review form functional
✅ 190 tests passing

---

### Wednesday (Day 13)
**Focus:** Review Display Components
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/components/reviews/ReviewCard.jsx` (15 tests)
- [ ] Write ReviewCard tests (RED phase)
- [ ] Implement ReviewCard (GREEN phase)
- [ ] Show user profile data (joined query)

**Afternoon (4h):**
- [ ] Create `src/components/reviews/ReviewList.jsx` (15 tests)
- [ ] Add pagination
- [ ] Add empty state ("No reviews yet")
- [ ] Responsive design

**Deliverable:**
✅ Review display working
✅ 220 tests passing

---

### Thursday (Day 14)
**Focus:** Review Filtering + Voting
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/components/reviews/ReviewFilters.jsx` (10 tests)
- [ ] Add filter by rating
- [ ] Add sort by: recent, helpful, rating
- [ ] Test filtering logic

**Afternoon (4h):**
- [ ] Create `src/components/reviews/ReviewVoteButtons.jsx` (10 tests)
- [ ] Implement helpful/not helpful voting
- [ ] Add vote count updates (triggers)
- [ ] Test: User can vote once

**Deliverable:**
✅ Filtering + voting working
✅ 240 tests passing

---

### Friday (Day 15)
**Focus:** Integration + Testing
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Integration test: Submit review → Appears in list
- [ ] Integration test: Vote helpful → Count updates
- [ ] Test moderation states (pending, approved)
- [ ] Accessibility audit

**Afternoon (4h):**
- [ ] Bug fixes
- [ ] Refactoring
- [ ] Performance testing
- [ ] Code review

**Deliverable:**
✅ 260+ review tests passing
✅ Week 3 complete

---

## Week 4: Images + Polish

### Monday (Day 16)
**Focus:** Image Upload Component
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/components/reviews/ReviewImageUpload.jsx` (15 tests)
- [ ] Write image upload tests (RED phase)
- [ ] Implement file input + preview
- [ ] Add file validation (size, type)

**Afternoon (4h):**
- [ ] Implement upload to Supabase Storage
- [ ] Add upload progress indicator
- [ ] Add image deletion
- [ ] Test: Max 5 images per review

**Deliverable:**
✅ Image upload functional
✅ 275 tests passing

---

### Tuesday (Day 17)
**Focus:** Image Display + Gallery
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Add image preview to ReviewForm
- [ ] Add image gallery to ReviewCard
- [ ] Add lightbox/modal for full-size view
- [ ] Optimize image loading (lazy load)

**Afternoon (4h):**
- [ ] Test: Images display correctly
- [ ] Test: Storage RLS policies
- [ ] Responsive design (mobile gallery)
- [ ] Accessibility (alt text, keyboard nav)

**Deliverable:**
✅ Image gallery working
✅ 290 tests passing

---

### Wednesday (Day 18)
**Focus:** Admin Moderation UI
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Create `src/pages/admin/ReviewModerationPage.jsx`
- [ ] Add approve/reject actions
- [ ] Add admin-only RLS check
- [ ] Test: Only admin can moderate

**Afternoon (4h):**
- [ ] Add bulk approve functionality
- [ ] Add rejection reason field
- [ ] Email notification (future: placeholder)
- [ ] Test: Approved reviews appear publicly

**Deliverable:**
✅ Moderation UI functional
✅ 305 tests passing

---

### Thursday (Day 19)
**Focus:** E2E Testing + Performance
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] E2E test: Sign up → Rate → Review
- [ ] E2E test: Upload image → Moderate → Display
- [ ] E2E test: Vote helpful → Count updates
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

**Afternoon (4h):**
- [ ] Performance optimization (lazy loading, code splitting)
- [ ] Lighthouse audit (target: >90)
- [ ] Bundle size analysis
- [ ] Load time testing

**Deliverable:**
✅ E2E tests passing
✅ Lighthouse >90

---

### Friday (Day 20)
**Focus:** Final Testing + Launch Prep
**Duration:** 6-8 hours

**Morning (4h):**
- [ ] Final accessibility audit (WCAG 2.1 AA)
- [ ] Final bug fixes
- [ ] Update documentation
- [ ] Create deployment checklist

**Afternoon (4h):**
- [ ] Deploy to Netlify (staging)
- [ ] Test on staging environment
- [ ] Final code review
- [ ] Sprint retrospective

**Deliverable:**
✅ 320+ total tests passing
✅ Zero critical bugs
✅ Ready for production
✅ Sprint 3 complete

---

## Daily Workflow Template

```
Morning (9am - 1pm):
├── Review previous day's work (15min)
├── Write tests (RED phase) (2h)
├── Implement feature (GREEN phase) (1.5h)
└── Quick test run (15min)

Afternoon (2pm - 6pm):
├── Refactor code (CLEAN phase) (1h)
├── Write more tests (edge cases) (1h)
├── Integration testing (1h)
└── Documentation + Git commit (1h)

Evening (optional):
└── Code review + planning for next day (30min)
```

---

## Test Checkpoints

| Day | Cumulative Tests | New Tests | Coverage |
|-----|-----------------|-----------|----------|
| 1   | 0               | -         | -        |
| 2   | 30              | 30        | 60%      |
| 3   | 60              | 30        | 70%      |
| 4   | 70              | 10        | 75%      |
| 5   | 80              | 10        | 80%      |
| 6   | 90              | 10        | 80%      |
| 7   | 110             | 20        | 82%      |
| 8   | 130             | 20        | 83%      |
| 9   | 140             | 10        | 84%      |
| 10  | 150             | 10        | 85%      |
| 11  | 165             | 15        | 85%      |
| 12  | 190             | 25        | 86%      |
| 13  | 220             | 30        | 87%      |
| 14  | 240             | 20        | 88%      |
| 15  | 260             | 20        | 88%      |
| 16  | 275             | 15        | 89%      |
| 17  | 290             | 15        | 89%      |
| 18  | 305             | 15        | 90%      |
| 19  | 320             | 15        | 90%      |
| 20  | 320+            | 0         | 90%+     |

---

## Progress Tracking

### Week 1 (Days 1-5)
```
Auth Foundation
[█████] Day 1: Supabase Setup
[█████] Day 2: Auth Context + Login
[█████] Day 3: Register + Modal
[█████] Day 4: Protected Routes
[█████] Day 5: Testing + Fixes
```

### Week 2 (Days 6-10)
```
Ratings System
[█████] Day 6: Rating Backend
[█████] Day 7: Star Rating UI
[█████] Day 8: Rating Stats
[█████] Day 9: Real-time + Optimistic
[█████] Day 10: Integration + Testing
```

### Week 3 (Days 11-15)
```
Reviews System
[█████] Day 11: Review Backend
[█████] Day 12: Review Form
[█████] Day 13: Review Display
[█████] Day 14: Filters + Voting
[█████] Day 15: Integration + Testing
```

### Week 4 (Days 16-20)
```
Images + Polish
[█████] Day 16: Image Upload
[█████] Day 17: Image Gallery
[█████] Day 18: Moderation UI
[█████] Day 19: E2E + Performance
[█████] Day 20: Final Testing + Launch
```

---

## Risk Mitigation Timeline

### Week 1 Risks
- **Auth complexity** → Use Supabase helpers (saves time)
- **Session persistence** → Test early (Day 2-3)

### Week 2 Risks
- **Real-time performance** → Debounce updates (Day 9)
- **Optimistic UI bugs** → Comprehensive error handling (Day 9)

### Week 3 Risks
- **Form validation** → Use Zod or similar (Day 12)
- **Moderation bottleneck** → Clear admin UI (Week 4)

### Week 4 Risks
- **Image upload failures** → Retry logic + error messages (Day 16)
- **Storage costs** → File size limits (Day 16)

---

## Celebration Milestones 🎉

- **Day 5:** Auth works! Users can sign up and sign in
- **Day 10:** Ratings live! Real-time updates working
- **Day 15:** Reviews functional! Community engagement enabled
- **Day 20:** Sprint 3 complete! Production-ready reviews system

---

**Next Steps:**
1. Print this timeline
2. Pin to wall/use as checklist
3. Update daily progress
4. Celebrate each milestone!

---

**Last Updated:** 2026-01-07
**Status:** Ready for Week 1
