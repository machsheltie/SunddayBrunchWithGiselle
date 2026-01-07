# Sprint 3 Implementation Plan
## User Reviews & Ratings System with Supabase Backend

**Version:** 1.0
**Created:** 2026-01-07
**Sprint Duration:** 3-4 weeks (solo development)
**Development Approach:** Test-Driven Development (TDD)
**Tech Stack:** React + Vite + Supabase (PostgreSQL + Auth + Storage)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Technical Architecture](#technical-architecture)
3. [Database Schema Design](#database-schema-design)
4. [API Specification](#api-specification)
5. [Component Architecture](#component-architecture)
6. [Implementation Phases](#implementation-phases)
7. [Testing Strategy](#testing-strategy)
8. [Agent Assignments](#agent-assignments)
9. [Risk Analysis](#risk-analysis)
10. [Success Metrics](#success-metrics)

---

## Executive Summary

### Sprint 3 Goals

**Primary Objectives:**
1. ✅ Implement user authentication (Supabase Auth)
2. ✅ Build recipe ratings system (1-5 stars)
3. ✅ Create recipe reviews system (with moderation)
4. ✅ Integrate with existing Sprint 1 & 2 features

**Key Constraint:**
- ❌ **NO user-submitted recipes** (only owner's recipes can be reviewed)

### Timeline & Phases

| Phase | Duration | Focus | Tests | Components |
|-------|----------|-------|-------|------------|
| **Phase 1** | Week 1 (5-7 days) | Supabase Setup + Auth | 30-40 tests | 5-6 auth components |
| **Phase 2** | Week 2 (5-7 days) | Ratings System | 25-30 tests | 4-5 rating components |
| **Phase 3** | Week 3 (5-7 days) | Reviews System | 35-40 tests | 6-7 review components |
| **Phase 4** | Week 4 (3-5 days) | Integration + Polish | 15-20 tests | Bug fixes, optimization |
| **TOTAL** | **3-4 weeks** | **All features** | **105-130 tests** | **20-23 components** |

### Success Metrics

- ✅ 100+ users registered (beta testing)
- ✅ 50+ recipes rated
- ✅ 20+ reviews submitted
- ✅ 80%+ test coverage maintained
- ✅ Zero critical security vulnerabilities
- ✅ WCAG 2.1 AA accessible
- ✅ <500ms API response time

---

## Technical Architecture

### Stack Overview

```
┌─────────────────────────────────────┐
│         Frontend (Netlify)          │
│   React 18 + Vite 6 + React Router  │
│                                      │
│   ┌──────────────────────────────┐  │
│   │   Auth Components            │  │
│   │   - LoginForm                │  │
│   │   - RegisterForm             │  │
│   │   - AuthProvider             │  │
│   └──────────────────────────────┘  │
│                                      │
│   ┌──────────────────────────────┐  │
│   │   Rating Components          │  │
│   │   - StarRating               │  │
│   │   - RatingStats              │  │
│   │   - RatingBreakdown          │  │
│   └──────────────────────────────┘  │
│                                      │
│   ┌──────────────────────────────┐  │
│   │   Review Components          │  │
│   │   - ReviewForm               │  │
│   │   - ReviewCard               │  │
│   │   - ReviewList               │  │
│   └──────────────────────────────┘  │
└─────────────────┬───────────────────┘
                  │
                  │ Supabase JS Client
                  │ (REST API + WebSockets)
                  │
┌─────────────────▼───────────────────┐
│       Backend (Supabase)             │
│                                      │
│   ┌──────────────────────────────┐  │
│   │   Supabase Auth              │  │
│   │   - JWT tokens               │  │
│   │   - Email/password           │  │
│   │   - OAuth (Google, optional) │  │
│   └──────────────────────────────┘  │
│                                      │
│   ┌──────────────────────────────┐  │
│   │   PostgreSQL Database        │  │
│   │   - users                    │  │
│   │   - recipe_ratings           │  │
│   │   - recipe_reviews           │  │
│   │   - review_votes             │  │
│   │   + Row-Level Security (RLS) │  │
│   └──────────────────────────────┘  │
│                                      │
│   ┌──────────────────────────────┐  │
│   │   Supabase Storage           │  │
│   │   - review-images bucket     │  │
│   │   - 5MB size limit           │  │
│   │   - JPEG, PNG, WebP          │  │
│   └──────────────────────────────┘  │
└──────────────────────────────────────┘
```

### State Management Strategy

**AuthContext (React Context API):**
- User session state
- Login/logout functions
- Protected route guards
- Token refresh logic

**React Query (Server State):**
- Recipe ratings fetching/caching
- Reviews fetching/caching/pagination
- Optimistic updates for ratings
- Real-time subscriptions (Supabase Realtime)

**Why this split?**
- Context API: Simple, works well for client state (user session)
- React Query: Excellent for server state, caching, optimistic updates

---

## Database Schema Design

### Supabase Tables

#### 1. `users` (Supabase Auth, auto-managed)

Supabase automatically creates this table. We'll extend it with a `public.profiles` table for additional user data.

```sql
-- public.profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### 2. `recipe_ratings`

```sql
CREATE TABLE public.recipe_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(recipe_slug, user_id) -- One rating per user per recipe
);

CREATE INDEX idx_ratings_recipe_slug ON recipe_ratings(recipe_slug);
CREATE INDEX idx_ratings_user_id ON recipe_ratings(user_id);

-- RLS Policies
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;

-- Anyone can read ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON public.recipe_ratings FOR SELECT
  USING (true);

-- Authenticated users can insert their own ratings
CREATE POLICY "Users can insert own ratings"
  ON public.recipe_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings"
  ON public.recipe_ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
  ON public.recipe_ratings FOR DELETE
  USING (auth.uid() = user_id);
```

#### 3. `recipe_reviews`

```sql
CREATE TABLE public.recipe_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- Optional, can rate without review
  title VARCHAR(255),
  content TEXT NOT NULL CHECK (char_length(content) >= 20), -- Minimum 20 characters
  images TEXT[], -- Array of Supabase Storage URLs

  -- Review metadata
  made_modifications BOOLEAN DEFAULT FALSE,
  would_make_again BOOLEAN,

  -- Moderation
  is_approved BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMP,
  moderation_notes TEXT,

  -- Engagement
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_recipe_slug ON recipe_reviews(recipe_slug);
CREATE INDEX idx_reviews_user_id ON recipe_reviews(user_id);
CREATE INDEX idx_reviews_approved ON recipe_reviews(is_approved, created_at DESC);

-- RLS Policies
ALTER TABLE public.recipe_reviews ENABLE ROW LEVEL SECURITY;

-- Everyone can read approved reviews
CREATE POLICY "Approved reviews are viewable by everyone"
  ON public.recipe_reviews FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id);

-- Authenticated users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON public.recipe_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews (before approval)
CREATE POLICY "Users can update own pending reviews"
  ON public.recipe_reviews FOR UPDATE
  USING (auth.uid() = user_id AND is_approved = false);

-- Only admins can approve/moderate reviews (add admin role check)
-- CREATE POLICY "Admins can moderate reviews" ON public.recipe_reviews FOR UPDATE ...
```

#### 4. `review_votes` (Helpful/Not Helpful)

```sql
CREATE TABLE public.review_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID REFERENCES public.recipe_reviews(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id) -- One vote per user per review
);

CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON review_votes(user_id);

-- RLS Policies
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

-- Users can read all votes (to see if they've voted)
CREATE POLICY "Votes are viewable by everyone"
  ON public.review_votes FOR SELECT
  USING (true);

-- Authenticated users can insert their own votes
CREATE POLICY "Users can insert own votes"
  ON public.review_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update own votes"
  ON public.review_votes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes"
  ON public.review_votes FOR DELETE
  USING (auth.uid() = user_id);
```

### Database Functions & Triggers

#### Update helpful counts when vote changes

```sql
CREATE OR REPLACE FUNCTION update_review_helpful_counts()
RETURNS TRIGGER AS $$
BEGIN
  -- Update helpful_count and not_helpful_count
  UPDATE public.recipe_reviews
  SET
    helpful_count = (
      SELECT COUNT(*) FROM public.review_votes
      WHERE review_id = NEW.review_id AND is_helpful = true
    ),
    not_helpful_count = (
      SELECT COUNT(*) FROM public.review_votes
      WHERE review_id = NEW.review_id AND is_helpful = false
    )
  WHERE id = NEW.review_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER review_vote_update
AFTER INSERT OR UPDATE OR DELETE ON public.review_votes
FOR EACH ROW EXECUTE FUNCTION update_review_helpful_counts();
```

#### Auto-update timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at
BEFORE UPDATE ON public.recipe_ratings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.recipe_reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## API Specification

### Supabase Client Setup

```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

### Auth Service

```javascript
// src/services/auth.service.js
import { supabase } from '../lib/supabase'

export const authService = {
  // Sign up with email/password
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata // { username, display_name }
      }
    })
    if (error) throw error
    return data
  },

  // Sign in with email/password
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  // Sign in with Google OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Subscribe to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}
```

### Ratings Service

```javascript
// src/services/rating.service.js
import { supabase } from '../lib/supabase'

export const ratingService = {
  // Get average rating for a recipe
  async getRecipeRating(recipeSlug) {
    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('rating')
      .eq('recipe_slug', recipeSlug)

    if (error) throw error

    if (data.length === 0) {
      return { average: 0, count: 0 }
    }

    const average = data.reduce((sum, r) => sum + r.rating, 0) / data.length
    return { average: average.toFixed(2), count: data.length }
  },

  // Get rating breakdown (count per star level)
  async getRatingBreakdown(recipeSlug) {
    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('rating')
      .eq('recipe_slug', recipeSlug)

    if (error) throw error

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    data.forEach(r => breakdown[r.rating]++)

    return breakdown
  },

  // Get user's rating for a recipe
  async getUserRating(recipeSlug, userId) {
    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('rating')
      .eq('recipe_slug', recipeSlug)
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data?.rating || null
  },

  // Rate a recipe (insert or update)
  async rateRecipe(recipeSlug, rating) {
    const { data: session } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('recipe_ratings')
      .upsert({
        recipe_slug: recipeSlug,
        user_id: session.user.id,
        rating
      }, {
        onConflict: 'recipe_slug,user_id'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete rating
  async deleteRating(recipeSlug) {
    const { data: session } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('recipe_ratings')
      .delete()
      .eq('recipe_slug', recipeSlug)
      .eq('user_id', session.user.id)

    if (error) throw error
  }
}
```

### Reviews Service

```javascript
// src/services/review.service.js
import { supabase } from '../lib/supabase'

export const reviewService = {
  // Get reviews for a recipe
  async getRecipeReviews(recipeSlug, { page = 1, limit = 10, sortBy = 'recent' } = {}) {
    let query = supabase
      .from('recipe_reviews')
      .select(`
        *,
        profiles:user_id (username, display_name, avatar_url)
      `, { count: 'exact' })
      .eq('recipe_slug', recipeSlug)
      .eq('is_approved', true)

    // Sort
    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false })
    } else if (sortBy === 'helpful') {
      query = query.order('helpful_count', { ascending: false })
    } else if (sortBy === 'rating_high') {
      query = query.order('rating', { ascending: false })
    } else if (sortBy === 'rating_low') {
      query = query.order('rating', { ascending: true })
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) throw error

    return {
      reviews: data,
      pagination: {
        page,
        limit,
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    }
  },

  // Submit a review
  async submitReview(recipeSlug, reviewData) {
    const { data: session } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('recipe_reviews')
      .insert({
        recipe_slug: recipeSlug,
        user_id: session.user.id,
        ...reviewData
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update a review
  async updateReview(reviewId, updates) {
    const { data, error } = await supabase
      .from('recipe_reviews')
      .update(updates)
      .eq('id', reviewId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Delete a review
  async deleteReview(reviewId) {
    const { error } = await supabase
      .from('recipe_reviews')
      .delete()
      .eq('id', reviewId)

    if (error) throw error
  },

  // Vote on a review
  async voteOnReview(reviewId, isHelpful) {
    const { data: session } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('review_votes')
      .upsert({
        review_id: reviewId,
        user_id: session.user.id,
        is_helpful: isHelpful
      }, {
        onConflict: 'review_id,user_id'
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Upload review image
  async uploadReviewImage(file) {
    const { data: session } = await supabase.auth.getSession()
    if (!session) throw new Error('Not authenticated')

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('review-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('review-images')
      .getPublicUrl(fileName)

    return publicUrl
  }
}
```

---

## Component Architecture

### File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx                 # Email/password login
│   │   ├── LoginForm.test.jsx            # 12-15 tests
│   │   ├── RegisterForm.jsx              # Email/password signup
│   │   ├── RegisterForm.test.jsx         # 12-15 tests
│   │   ├── AuthProvider.jsx              # Context provider
│   │   ├── AuthProvider.test.jsx         # 8-10 tests
│   │   ├── ProtectedRoute.jsx            # Route guard
│   │   └── ProtectedRoute.test.jsx       # 5-7 tests
│   │
│   ├── ratings/
│   │   ├── StarRating.jsx                # Interactive star component
│   │   ├── StarRating.test.jsx           # 10-12 tests
│   │   ├── RatingStats.jsx               # Average + count display
│   │   ├── RatingStats.test.jsx          # 6-8 tests
│   │   ├── RatingBreakdown.jsx           # 5-star histogram
│   │   ├── RatingBreakdown.test.jsx      # 8-10 tests
│   │   └── RateRecipeButton.jsx          # CTA button
│   │
│   ├── reviews/
│   │   ├── ReviewForm.jsx                # Submit review form
│   │   ├── ReviewForm.test.jsx           # 15-18 tests
│   │   ├── ReviewCard.jsx                # Single review display
│   │   ├── ReviewCard.test.jsx           # 10-12 tests
│   │   ├── ReviewList.jsx                # Paginated list
│   │   ├── ReviewList.test.jsx           # 12-15 tests
│   │   ├── ReviewFilters.jsx             # Sort/filter controls
│   │   ├── ReviewVoteButtons.jsx         # Helpful/not helpful
│   │   ├── ImageUpload.jsx               # Review image upload
│   │   └── ImageUpload.test.jsx          # 8-10 tests
│   │
│   └── common/
│       ├── Modal.jsx                     # Reusable modal
│       ├── Modal.test.jsx                # 6-8 tests
│       ├── Toast.jsx                     # Success/error notifications
│       └── Avatar.jsx                    # User avatar display
│
├── contexts/
│   └── AuthContext.jsx                   # Auth state management
│
├── hooks/
│   ├── useAuth.js                        # Auth hook
│   ├── useAuth.test.js                   # 8-10 tests
│   ├── useRating.js                      # Rating mutations
│   ├── useRating.test.js                 # 10-12 tests
│   ├── useReviews.js                     # Reviews queries
│   └── useReviews.test.js                # 12-15 tests
│
├── services/
│   ├── auth.service.js                   # Auth API calls
│   ├── rating.service.js                 # Rating API calls
│   └── review.service.js                 # Review API calls
│
├── lib/
│   └── supabase.js                       # Supabase client config
│
└── pages/
    ├── LoginPage.jsx                     # Login page
    ├── RegisterPage.jsx                  # Registration page
    └── RecipePage.jsx                    # Enhanced with ratings/reviews
```

### Component Specifications

#### `StarRating.jsx`

```jsx
import { useState } from 'react'
import PropTypes from 'prop-types'
import './StarRating.css'

/**
 * Interactive star rating component (1-5 stars)
 * @param {number} value - Current rating (0-5)
 * @param {function} onChange - Callback when rating changes
 * @param {boolean} readOnly - If true, stars are not clickable
 * @param {string} size - Size of stars ('small' | 'medium' | 'large')
 */
function StarRating({ value, onChange, readOnly = false, size = 'medium' }) {
  const [hoverValue, setHoverValue] = useState(0)

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating)
    }
  }

  return (
    <div className={`star-rating star-rating--${size}`} role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= (hoverValue || value) ? 'star--filled' : 'star--empty'}`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readOnly && setHoverValue(star)}
          onMouseLeave={() => !readOnly && setHoverValue(0)}
          disabled={readOnly}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

StarRating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large'])
}

export default StarRating
```

#### `AuthProvider.jsx`

```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Check active session
    authService.getSession().then((session) => {
      setSession(session)
      setUser(session?.user || null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user || null)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const value = {
    user,
    session,
    loading,
    signIn: authService.signIn,
    signUp: authService.signUp,
    signOut: authService.signOut,
    signInWithGoogle: authService.signInWithGoogle
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
```

---

## Implementation Phases

### Phase 1: Supabase Setup + Authentication (Week 1)

**Duration:** 5-7 days
**Focus:** Get authentication working end-to-end

#### Tasks

**Day 1-2: Supabase Project Setup**
- [ ] Create Supabase project at [supabase.com](https://supabase.com/)
- [ ] Configure database schema (run SQL migrations)
- [ ] Set up Row-Level Security policies
- [ ] Create storage bucket for review images
- [ ] Configure authentication providers (email, Google)
- [ ] Add environment variables to Netlify

**Day 3-4: Frontend Auth Integration**
- [ ] Install @supabase/supabase-js
- [ ] Create AuthProvider component
- [ ] Build LoginForm component (TDD)
- [ ] Build RegisterForm component (TDD)
- [ ] Create ProtectedRoute component
- [ ] Add auth pages (LoginPage, RegisterPage)
- [ ] Integrate with React Router

**Day 5-6: Testing & Polish**
- [ ] Write 30-40 auth tests
- [ ] E2E test: register → login → protected page
- [ ] Handle error states (invalid credentials, network errors)
- [ ] Add loading states
- [ ] Accessibility audit (keyboard nav, screen readers)

**Day 7: Code Review & Documentation**
- [ ] Run code review agent
- [ ] Fix any critical issues
- [ ] Update documentation
- [ ] Commit and deploy to staging

**Deliverables:**
- ✅ Users can register with email/password
- ✅ Users can login/logout
- ✅ Protected routes redirect to login
- ✅ 30-40 tests passing
- ✅ Auth documentation

**Agent Assignments:**
- `api-scaffolding:backend-architect` - Supabase schema design
- `frontend-mobile-development:frontend-developer` - Auth components
- `full-stack-orchestration:test-automator` - Auth tests
- `security-compliance:security-auditor` - RLS policy review

---

### Phase 2: Ratings System (Week 2)

**Duration:** 5-7 days
**Focus:** Star ratings with real-time updates

#### Tasks

**Day 1-2: Backend Setup**
- [ ] Verify recipe_ratings table and RLS policies
- [ ] Create rating service functions
- [ ] Test rating CRUD operations
- [ ] Set up optimistic updates with React Query

**Day 3-4: Frontend Components**
- [ ] Build StarRating component (TDD)
- [ ] Build RatingStats component (TDD)
- [ ] Build RatingBreakdown component (TDD)
- [ ] Build RateRecipeButton component
- [ ] Integrate with RecipePage

**Day 5-6: Real-time & Polish**
- [ ] Add Supabase Realtime subscriptions for live rating updates
- [ ] Implement optimistic UI updates
- [ ] Handle edge cases (no ratings, user already rated)
- [ ] Add animations (star fill animation)
- [ ] Write 25-30 rating tests

**Day 7: Code Review & Documentation**
- [ ] Run code review agent
- [ ] Performance testing (rating aggregation)
- [ ] Accessibility audit
- [ ] Deploy to staging

**Deliverables:**
- ✅ Users can rate recipes 1-5 stars
- ✅ Average rating displays in real-time
- ✅ Rating breakdown (histogram)
- ✅ One rating per user per recipe enforced
- ✅ 25-30 tests passing

**Agent Assignments:**
- `database-design:database-architect` - Rating aggregation optimization
- `frontend-mobile-development:frontend-developer` - Rating components
- `application-performance:performance-engineer` - Real-time optimization
- `full-stack-orchestration:test-automator` - Rating tests

---

### Phase 3: Reviews System (Week 3)

**Duration:** 5-7 days
**Focus:** Full review submission and moderation

#### Tasks

**Day 1-2: Backend Setup**
- [ ] Verify recipe_reviews table and RLS policies
- [ ] Create review service functions
- [ ] Set up image upload to Supabase Storage
- [ ] Configure image size limits and formats

**Day 3-4: Frontend Components**
- [ ] Build ReviewForm component (TDD)
- [ ] Build ReviewCard component (TDD)
- [ ] Build ReviewList component (TDD)
- [ ] Build ImageUpload component (TDD)
- [ ] Add pagination to ReviewList

**Day 5-6: Review Voting & Polish**
- [ ] Build ReviewVoteButtons component
- [ ] Implement helpful/not helpful voting
- [ ] Add review filtering/sorting
- [ ] Handle moderation states (pending approval)
- [ ] Write 35-40 review tests

**Day 7: Code Review & Documentation**
- [ ] Run code review agent
- [ ] E2E test: submit review → see in list
- [ ] Accessibility audit
- [ ] Deploy to staging

**Deliverables:**
- ✅ Users can submit text reviews
- ✅ Users can upload review images (up to 3)
- ✅ Reviews show user info (name, avatar)
- ✅ Helpful/not helpful voting works
- ✅ Reviews paginated (10 per page)
- ✅ 35-40 tests passing

**Agent Assignments:**
- `api-scaffolding:backend-architect` - Review moderation workflow
- `frontend-mobile-development:frontend-developer` - Review components
- `security-compliance:security-auditor` - Image upload security
- `full-stack-orchestration:test-automator` - Review tests

---

### Phase 4: Integration & Polish (Week 4)

**Duration:** 3-5 days
**Focus:** Bug fixes, optimization, final testing

#### Tasks

**Day 1-2: Integration Testing**
- [ ] E2E tests for full user journey (register → rate → review)
- [ ] Integration tests between ratings and reviews
- [ ] Test offline scenarios (network failures)
- [ ] Performance testing (load time with 100+ reviews)

**Day 3-4: Bug Fixes & Polish**
- [ ] Fix any bugs found in testing
- [ ] Optimize bundle size
- [ ] Add loading skeletons
- [ ] Polish animations and transitions
- [ ] Mobile responsiveness testing

**Day 5: Launch Preparation**
- [ ] Run security audit agent
- [ ] Run comprehensive code review
- [ ] Update documentation
- [ ] Create admin moderation guide
- [ ] Deploy to production

**Deliverables:**
- ✅ All 105-130 tests passing
- ✅ Zero critical bugs
- ✅ Lighthouse score >90
- ✅ WCAG 2.1 AA compliant
- ✅ Production deployment

**Agent Assignments:**
- `comprehensive-review:code-reviewer` - Final code review
- `security-compliance:security-auditor` - Security audit
- `application-performance:performance-engineer` - Performance optimization
- `cicd-automation:deployment-engineer` - Production deployment

---

## Testing Strategy

### Test Coverage Goals

| Layer | Target Coverage | Test Count |
|-------|----------------|-----------|
| Auth Components | 100% | 30-40 tests |
| Rating Components | 100% | 25-30 tests |
| Review Components | 100% | 35-40 tests |
| Hooks | 100% | 30-35 tests |
| Services | 90%+ | 15-20 tests |
| E2E Flows | Critical paths | 5-10 tests |
| **TOTAL** | **80%+** | **105-130 tests** |

### Test Types

**Unit Tests (Vitest + React Testing Library):**
- Component rendering
- User interactions (click, type, submit)
- PropTypes validation
- Edge cases (empty states, errors)

**Integration Tests:**
- Supabase client interactions
- Auth state management
- Rating optimistic updates
- Review pagination

**E2E Tests (Playwright - optional for Sprint 3):**
- Register → Login → Rate → Review flow
- Image upload flow
- Review voting flow

### Example Test

```javascript
// StarRating.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('should render 5 stars', () => {
    render(<StarRating value={0} onChange={vi.fn()} />)
    const stars = screen.getAllByRole('button')
    expect(stars).toHaveLength(5)
  })

  it('should highlight stars on hover', () => {
    render(<StarRating value={0} onChange={vi.fn()} />)
    const thirdStar = screen.getAllByRole('button')[2]

    fireEvent.mouseEnter(thirdStar)

    expect(thirdStar).toHaveClass('star--filled')
  })

  it('should call onChange with correct rating', () => {
    const onChange = vi.fn()
    render(<StarRating value={0} onChange={onChange} />)
    const fourthStar = screen.getAllByRole('button')[3]

    fireEvent.click(fourthStar)

    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('should not allow interaction when readOnly', () => {
    const onChange = vi.fn()
    render(<StarRating value={3} onChange={onChange} readOnly />)
    const fifthStar = screen.getAllByRole('button')[4]

    fireEvent.click(fifthStar)

    expect(onChange).not.toHaveBeenCalled()
  })
})
```

---

## Agent Assignments

### By Phase

| Phase | Primary Agent | Supporting Agents |
|-------|--------------|-------------------|
| **Phase 1: Auth** | `api-scaffolding:backend-architect` | `frontend-mobile-development:frontend-developer`, `security-compliance:security-auditor` |
| **Phase 2: Ratings** | `frontend-mobile-development:frontend-developer` | `application-performance:performance-engineer`, `database-design:database-architect` |
| **Phase 3: Reviews** | `frontend-mobile-development:frontend-developer` | `security-compliance:security-auditor`, `api-scaffolding:backend-architect` |
| **Phase 4: Polish** | `comprehensive-review:code-reviewer` | `application-performance:performance-engineer`, `cicd-automation:deployment-engineer` |

### Agent Responsibilities

**`api-scaffolding:backend-architect`:**
- Design Supabase schema
- Create RLS policies
- Design API service functions
- Review database performance

**`frontend-mobile-development:frontend-developer`:**
- Build React components
- Implement state management
- Handle user interactions
- Mobile responsive design

**`security-compliance:security-auditor`:**
- Audit RLS policies
- Review authentication flow
- Check image upload security
- Verify OWASP compliance

**`full-stack-orchestration:test-automator`:**
- Write unit tests
- Write integration tests
- Maintain test coverage
- CI/CD test integration

**`application-performance:performance-engineer`:**
- Optimize real-time subscriptions
- Database query optimization
- Bundle size optimization
- Lighthouse performance audits

**`comprehensive-review:code-reviewer`:**
- Final code review
- Identify code smells
- Suggest refactorings
- Verify best practices

---

## Risk Analysis

### High-Risk Items

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Supabase RLS misconfiguration** | Medium | Critical | Thorough testing, security audit agent, manual review |
| **Image upload abuse** | High | Medium | File size limits (5MB), format validation, rate limiting |
| **Review spam** | High | Medium | Manual moderation, CAPTCHA (future), rate limiting |
| **Optimistic update bugs** | Medium | Medium | Comprehensive testing, rollback on error |
| **Auth token expiration handling** | Medium | High | Auto-refresh tokens, graceful session timeout |
| **Database performance (100+ reviews)** | Low | Medium | Pagination, indexes, caching |
| **Real-time subscription overhead** | Low | Medium | Conditional subscriptions, cleanup on unmount |

### Mitigation Strategies

**For RLS Security:**
1. Test RLS policies with multiple user accounts
2. Use security audit agent to review policies
3. Add integration tests that attempt unauthorized access
4. Manual penetration testing

**For Image Upload:**
1. Client-side validation (file size, format)
2. Server-side validation (Supabase Storage policies)
3. Virus scanning (future enhancement)
4. Rate limiting per user

**For Review Spam:**
1. Manual moderation queue
2. Minimum review length (20 characters)
3. Rate limiting (1 review per recipe per user)
4. Future: CAPTCHA, trust score

---

## Success Metrics

### Technical Metrics

- ✅ **Test Coverage:** 80%+ overall (target: 90%+)
- ✅ **Test Pass Rate:** 100% (105-130 tests)
- ✅ **Lighthouse Performance:** >90
- ✅ **API Response Time:** <500ms average
- ✅ **Time to Interactive:** <3s
- ✅ **Zero Critical Security Vulnerabilities**
- ✅ **WCAG 2.1 AA Compliant**

### User Metrics (Beta Testing)

- ✅ **Registered Users:** 100+ in first 2 weeks
- ✅ **Recipes Rated:** 50+ ratings submitted
- ✅ **Reviews Submitted:** 20+ approved reviews
- ✅ **User Retention:** 30%+ return within 7 days
- ✅ **Average Rating Completion Time:** <30 seconds
- ✅ **Average Review Completion Time:** <3 minutes

### Quality Metrics

- ✅ **Code Review Score:** A- or higher (90%+)
- ✅ **Security Audit:** No P0 or P1 issues
- ✅ **Accessibility Score:** 100% (WCAG 2.1 AA)
- ✅ **Mobile Responsiveness:** Works on 3+ devices
- ✅ **Cross-Browser Compatibility:** Chrome, Firefox, Safari, Edge

---

## Next Steps After Sprint 3

### Sprint 4: User Profiles & Collections (Month 2)
- User profile pages
- Recipe collections (save to favorites)
- User activity dashboard
- Follow/unfollow users (optional)

### Sprint 5: Monetization (Month 2-3)
- Premium tier (ad-free + exclusive recipes)
- Stripe integration
- Affiliate link system
- Display ads (Mediavine)

### Sprint 6: Advanced Features (Month 3+)
- Comments system (threaded)
- Meal planning tools
- Shopping list generation
- Video tutorial integration

---

## Appendix

### Environment Variables

```bash
# .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Supabase Project Setup Checklist

- [ ] Create project at [supabase.com](https://supabase.com/)
- [ ] Run database migrations (SQL tab)
- [ ] Enable authentication providers (Settings → Auth)
- [ ] Create storage bucket `review-images` (public, 5MB limit)
- [ ] Configure email templates (Settings → Auth → Email Templates)
- [ ] Add environment variables to Netlify
- [ ] Test connection from local dev environment

### Useful Commands

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build

# Deploy to Netlify (automatic on git push)
git push origin main
```

---

**Document Status:** Sprint 3 Implementation Plan v1.0
**Created by:** Claude Code + Sequential Thinking Agent
**Last Updated:** 2026-01-07
**Next Review:** After Phase 1 completion
