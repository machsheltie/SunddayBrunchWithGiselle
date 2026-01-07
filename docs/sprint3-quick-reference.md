# Sprint 3: Quick Reference Guide

**Full Plan:** See [sprint3-implementation-plan.md](./sprint3-implementation-plan.md)

---

## Overview

**Goal:** Add user authentication, ratings, and reviews using Supabase
**Timeline:** 3-4 weeks (solo development)
**Tech Stack:** React + Vite + Supabase (PostgreSQL + Auth + Storage)
**Test Coverage:** 85%+ (150+ tests)

---

## Key Decisions

### ✅ Supabase (APPROVED)
- **Why:** Saves 80+ hours vs custom backend
- **Cost:** $0/month for MVP (<500 users)
- **Features:** Auth + Database + Storage + Real-time

### ⚠️ Important Constraints
- ❌ NO user-submitted recipes (owner only)
- ✅ Manual moderation for all reviews
- ✅ Email/password only (no OAuth for MVP)
- ✅ TDD mandatory (80%+ coverage)

---

## Database Schema (5 Tables)

```sql
1. profiles (user data)
   - Links to auth.users
   - username, display_name, avatar_url, bio

2. recipe_ratings
   - One rating per user per recipe
   - recipe_slug, user_id, rating (1-5)

3. recipe_reviews
   - recipe_slug, user_id, rating, title, content, images[]
   - Moderation: is_approved, moderated_by, moderated_at
   - Engagement: helpful_count, not_helpful_count

4. review_votes
   - Helpful/not helpful votes
   - review_id, user_id, is_helpful

5. recipe_rating_stats (VIEW)
   - Aggregated rating statistics
   - average_rating, total_ratings, breakdown
```

---

## 4-Week Timeline

### Week 1: Authentication (40% complexity)
**Days 1-2:** Supabase setup + Auth UI
**Days 3-4:** Protected routes + session persistence
**Day 5:** Testing (40+ tests)

**Deliverable:** Users can sign up, sign in, and access protected features

---

### Week 2: Ratings System (30% complexity)
**Day 1:** Rating service + backend integration
**Days 2-3:** Star rating components
**Day 4:** Real-time updates + optimistic UI
**Day 5:** Testing (60+ tests total)

**Deliverable:** Users can rate recipes with live updates

---

### Week 3: Reviews System (70% complexity)
**Days 1-2:** Review submission form
**Days 3-4:** Review display + filtering + voting
**Day 5:** Testing (80+ tests total)

**Deliverable:** Users can write and read reviews with voting

---

### Week 4: Polish + Images (30% complexity)
**Days 1-2:** Image uploads (Supabase Storage)
**Day 3:** Admin moderation UI
**Days 4-5:** Final testing + bug fixes (120+ tests total)

**Deliverable:** Production-ready reviews with image support

---

## Critical Components

### Authentication
```typescript
// src/context/AuthContext.jsx
- Provides: user, session, isAuthenticated, signUp, signIn, signOut
- Tests: 30+

// src/components/auth/LoginForm.jsx
- Email/password form with validation
- Tests: 15+

// src/components/auth/RegisterForm.jsx
- Sign up form with username
- Tests: 15+
```

### Ratings
```typescript
// src/components/ratings/StarRating.jsx
- Interactive 1-5 star selector
- Tests: 15+

// src/components/ratings/RatingStats.jsx
- Average + breakdown histogram
- Tests: 15+

// src/services/rating.service.ts
- getRecipeStats, getUserRating, rateRecipe
- Tests: 10+
```

### Reviews
```typescript
// src/components/reviews/ReviewForm.jsx
- Rating + title + content + images + checkboxes
- Tests: 20+

// src/components/reviews/ReviewList.jsx
- Display reviews with filtering/sorting
- Tests: 15+

// src/services/review.service.ts
- getReviews, createReview, voteReview, uploadImage
- Tests: 15+
```

---

## Testing Breakdown

| Phase | Unit Tests | Integration | E2E | Total |
|-------|-----------|-------------|-----|-------|
| Week 1: Auth | 30 | 5 | 2 | 37 |
| Week 2: Ratings | 40 | 8 | 2 | 50 |
| Week 3: Reviews | 50 | 10 | 3 | 63 |
| Week 4: Polish | 20 | 5 | 5 | 30 |
| **TOTAL** | **140** | **28** | **12** | **180** |

---

## Supabase Setup Checklist

### Day 1 (2-3 hours)
- [ ] Create Supabase project: `sunday-brunch-reviews`
- [ ] Enable email/password auth
- [ ] Copy Project URL and Anon Key to `.env`
- [ ] Run SQL schema (5 tables + triggers + RLS)
- [ ] Create `review-images` storage bucket
- [ ] Test: Create user in Dashboard
- [ ] Test: RLS policies work
- [ ] Generate TypeScript types: `npx supabase gen types typescript`

### Environment Variables
```bash
# .env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

### SQL to Run (in Supabase SQL Editor)
1. Create profiles table + trigger
2. Create recipe_ratings table + RLS
3. Create recipe_reviews table + RLS
4. Create review_votes table + RLS + triggers
5. Create recipe_rating_stats view

*See full SQL in sprint3-implementation-plan.md*

---

## Risk Mitigation

### Top 5 Risks

1. **RLS Misconfiguration** → Test with multiple user accounts
2. **Image Upload Abuse** → 5MB limit, rate limiting, moderation
3. **Spam Reviews** → Manual moderation + rate limiting
4. **Auth Token Expiry** → Auto-refresh tokens
5. **Low Review Submission** → Prominent CTAs, email reminders

---

## Success Metrics

### Week 1 Complete
- ✅ 40+ tests passing
- ✅ Users can sign up/sign in
- ✅ Protected routes work

### Week 2 Complete
- ✅ 60+ tests passing
- ✅ Users can rate recipes
- ✅ Real-time updates work

### Week 3 Complete
- ✅ 80+ tests passing
- ✅ Users can submit reviews
- ✅ Reviews display with filtering

### Week 4 Complete
- ✅ 120+ tests passing
- ✅ Image uploads work
- ✅ Admin moderation UI complete
- ✅ Zero critical bugs

### Sprint 3 Success
- ✅ 85%+ test coverage
- ✅ 150+ tests passing
- ✅ WCAG 2.1 AA compliant
- ✅ Lighthouse score >90
- ✅ Production deployment

---

## Quick Commands

```bash
# Development
npm run dev                    # Start Vite dev server
npm run test                   # Run tests
npm run test:watch             # Watch mode
npm run test:coverage          # Coverage report

# Supabase (if using CLI)
npx supabase init              # Initialize project
npx supabase start             # Local Supabase (optional)
npx supabase gen types         # Generate TypeScript types

# Deployment
git push origin main           # Auto-deploy to Netlify
```

---

## File Structure Preview

```
src/
├── components/
│   ├── auth/           (5 files, 30 tests)
│   ├── ratings/        (4 files, 40 tests)
│   ├── reviews/        (6 files, 50 tests)
│   └── common/         (3 files, 10 tests)
│
├── services/           (3 files, 30 tests)
│   ├── auth.service.ts
│   ├── rating.service.ts
│   └── review.service.ts
│
├── hooks/              (4 files, 15 tests)
│   ├── useAuth.js
│   ├── useRating.js
│   ├── useReviews.js
│   └── useSupabaseQuery.js
│
├── lib/                (2 files)
│   ├── supabase.ts
│   └── database.types.ts (auto-generated)
│
├── context/            (1 file, 5 tests)
│   └── AuthContext.jsx
│
└── utils/              (2 files, 10 tests)
    ├── validators.js
    └── formatters.js
```

---

## Key APIs

### Authentication
```typescript
await authService.signUp({ email, password, username })
await authService.signIn({ email, password })
await authService.signOut()
const session = await authService.getSession()
```

### Ratings
```typescript
const stats = await ratingService.getRecipeStats(recipeSlug)
const rating = await ratingService.rateRecipe(recipeSlug, 5)
ratingService.subscribeToRecipeRatings(recipeSlug, callback)
```

### Reviews
```typescript
const reviews = await reviewService.getReviews(recipeSlug, { sort: 'helpful' })
const review = await reviewService.createReview({ recipe_slug, rating, content })
const imageUrl = await reviewService.uploadReviewImage(file, userId)
await reviewService.voteReview(reviewId, isHelpful)
```

---

## Next Steps

1. **Read full plan:** [sprint3-implementation-plan.md](./sprint3-implementation-plan.md)
2. **Get approval** on technical decisions
3. **Create Supabase project** (Day 1, Week 1)
4. **Start TDD:** Write first auth test

---

**Last Updated:** 2026-01-07
**Status:** Ready for implementation
