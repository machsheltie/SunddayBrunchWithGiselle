# Sprint 3: User Reviews & Ratings System - Implementation Plan

**Version:** 1.0
**Created:** 2026-01-07
**Status:** Planning Phase
**Approach:** Test-Driven Development (TDD)
**Timeline:** 3-4 weeks (Solo Development)
**Tech Stack:** React + Vite + Supabase (PostgreSQL + Auth + Storage)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Sprint 3 Goals & Scope](#sprint-3-goals--scope)
4. [Supabase Architecture](#supabase-architecture)
5. [Database Schema Design](#database-schema-design)
6. [API Specification](#api-specification)
7. [Component Architecture](#component-architecture)
8. [Implementation Phases](#implementation-phases)
9. [Testing Strategy](#testing-strategy)
10. [Risk Analysis & Mitigation](#risk-analysis--mitigation)
11. [Success Metrics](#success-metrics)
12. [Migration Path](#migration-path)

---

## Executive Summary

### Goal
Add user authentication, recipe ratings, and reviews to Sunday Brunch with Giselle website using Supabase backend, transforming it from static site to interactive community platform.

### Key Constraints
- ✅ **NO user-submitted recipes** (only owner's recipes can be reviewed)
- ✅ Test-Driven Development (TDD) mandatory
- ✅ Maintain 80%+ test coverage
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Solo development (3-4 weeks)
- ✅ Current site already deployed to Netlify

### Technology Decision: **Supabase (APPROVED)**

**Why Supabase over custom backend?**

| Aspect | Supabase | Custom Backend (Express) | Winner |
|--------|----------|-------------------------|---------|
| **Setup Time** | 1-2 hours | 1-2 weeks | ✅ Supabase |
| **Auth Complexity** | Built-in (JWT + OAuth) | 40+ hours manual | ✅ Supabase |
| **Cost (MVP)** | $0/month | $27+/month | ✅ Supabase |
| **Type Safety** | TypeScript SDK | Manual typing | ✅ Supabase |
| **Real-time** | Built-in | Manual WebSockets | ✅ Supabase |
| **RLS Security** | Built-in | Manual policies | ✅ Supabase |
| **Hosting** | Managed | Self-hosted | ✅ Supabase |
| **Scaling** | Automatic | Manual | ✅ Supabase |

**Verdict:** Supabase saves 80+ hours of development time with superior DX.

### Timeline Overview

```
Week 1: Supabase Setup + Authentication (40% complete)
├── Supabase project creation (Day 1)
├── Auth UI components (Days 2-3)
├── Protected routes (Day 4)
└── Testing (Day 5)

Week 2: Ratings System (30% complete)
├── Database schema (Day 1)
├── Star rating component (Days 2-3)
├── Optimistic updates (Day 4)
└── Testing (Day 5)

Week 3: Reviews System (70% complete)
├── Review submission (Days 1-2)
├── Review display + filtering (Days 3-4)
└── Testing (Day 5)

Week 4: Polish + Image Uploads (30% complete)
├── Review photos (Days 1-2)
├── Moderation UI (Day 3)
├── Final testing + fixes (Days 4-5)
```

---

## Current State Analysis

### ✅ Strengths (From Sprints 1-2)

1. **Excellent Test Coverage**
   - 149/149 tests passing (100%)
   - 91% grade (A-)
   - TDD culture established

2. **Modern Stack**
   - React 19.2.0 + Vite
   - Tailwind CSS 4.x
   - Deployed to Netlify

3. **Completed Features**
   - Advanced search (Fuse.js)
   - Recipe filters (7 categories, 40+ options)
   - Nutrition facts (FDA compliant)
   - Dietary badges
   - Allergen warnings

4. **Existing Components**
   - RecipeCard.jsx
   - AudioPlayer.jsx
   - EpisodePage.jsx

### ❌ Missing Features (Sprint 3 Scope)

1. **No User Accounts**
   - Can't save favorites
   - Can't leave reviews
   - No personalization

2. **No Community Engagement**
   - No ratings (5-star system)
   - No reviews (text + photos)
   - No helpful votes

3. **No Backend Integration**
   - All data is static JSON
   - No database persistence
   - No real-time updates

### 🎯 Competitive Gaps Addressed

| Feature | Before | After Sprint 3 | Competitor Avg | Gap |
|---------|--------|----------------|----------------|-----|
| User Engagement | 3/10 | **8/10** ⬆️ | 7/10 | **+1** |
| Social Features | 2/10 | **7/10** ⬆️ | 7/10 | **0** |
| Personalization | 0/10 | **6/10** ⬆️ | 6/10 | **0** |

---

## Sprint 3 Goals & Scope

### Primary Goals

#### 1. User Authentication (Supabase Auth)
- ✅ Email/password registration
- ✅ Email/password login
- ✅ Session persistence (JWT tokens)
- ✅ Protected routes
- ⚠️ Optional: Social OAuth (Google/Facebook) - **Post-MVP**

#### 2. Recipe Ratings System
- ✅ Users can rate recipes 1-5 stars
- ✅ One rating per user per recipe (enforced by RLS)
- ✅ Real-time average rating display
- ✅ Rating breakdown (5-star histogram)
- ✅ Optimistic updates for instant feedback

#### 3. Recipe Reviews System
- ✅ Users can write text reviews
- ✅ Include rating with review
- ✅ Review photos (Supabase Storage)
- ✅ Review moderation (approve/reject)
- ✅ Helpful/not helpful voting

### Out of Scope (Sprint 4+)

- ❌ User-submitted recipes (owner only)
- ❌ Comments/replies to reviews (Phase 2)
- ❌ User profiles (Phase 2)
- ❌ Recipe collections (Phase 2)
- ❌ Email notifications (Phase 2)
- ❌ Advanced moderation tools (Phase 3)

---

## Supabase Architecture

### Why Supabase?

**Decision Factors:**
1. **Integrated Stack** - Auth + Database + Storage in one
2. **Row-Level Security** - Built-in security policies
3. **Real-time Subscriptions** - Live rating updates
4. **TypeScript SDK** - Type-safe queries
5. **Free Tier** - $0/month for MVP (<500 users)
6. **Managed Infrastructure** - No DevOps overhead

### Supabase Project Structure

```
sunday-brunch-supabase/
├── Database (PostgreSQL 15)
│   ├── auth.users (managed by Supabase)
│   ├── public.profiles (custom)
│   ├── public.recipe_ratings
│   ├── public.recipe_reviews
│   └── public.review_votes
│
├── Storage
│   └── review-images/ (public bucket)
│
├── Auth
│   ├── Email/Password provider
│   ├── JWT tokens (15min access, 7day refresh)
│   └── Row Level Security policies
│
└── Functions (Edge Functions - future)
    └── moderate-review (auto-flag spam)
```

### Integration with Existing Site

```
Current Architecture:
┌─────────────────┐
│  Netlify (Host) │
│                 │
│  ┌───────────┐  │
│  │ React App │  │
│  │ (Static)  │  │
│  └───────────┘  │
└─────────────────┘

After Sprint 3:
┌─────────────────┐      ┌──────────────────┐
│  Netlify (Host) │◄────►│ Supabase Backend │
│                 │      │                  │
│  ┌───────────┐  │      │  ┌────────────┐  │
│  │ React App │──┼─────►│  │ PostgreSQL │  │
│  │ (Dynamic) │  │      │  └────────────┘  │
│  └───────────┘  │      │                  │
│                 │      │  ┌────────────┐  │
│                 │      │  │  Storage   │  │
│                 │      │  └────────────┘  │
└─────────────────┘      └──────────────────┘
```

---

## Database Schema Design

### Supabase Tables (5 tables)

#### 1. Profiles Table (Custom User Data)

```sql
-- Create profiles table
-- Links to auth.users automatically via trigger
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Indexes
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Auto-create profile on user signup (trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**TypeScript Type:**
```typescript
export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}
```

#### 2. Recipe Ratings Table

```sql
-- Create recipe_ratings table
CREATE TABLE public.recipe_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One rating per user per recipe
  UNIQUE(recipe_slug, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view ratings"
  ON public.recipe_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert ratings"
  ON public.recipe_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON public.recipe_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON public.recipe_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_ratings_recipe ON public.recipe_ratings(recipe_slug);
CREATE INDEX idx_ratings_user ON public.recipe_ratings(user_id);
CREATE INDEX idx_ratings_created ON public.recipe_ratings(created_at DESC);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_recipe_ratings_updated_at
  BEFORE UPDATE ON public.recipe_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

**TypeScript Type:**
```typescript
export interface RecipeRating {
  id: string;
  recipe_slug: string;
  user_id: string;
  rating: number; // 1-5
  created_at: string;
  updated_at: string;
}
```

#### 3. Recipe Reviews Table

```sql
-- Create recipe_reviews table
CREATE TABLE public.recipe_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT NOT NULL,
  images TEXT[], -- Array of Storage URLs

  -- Review metadata
  made_modifications BOOLEAN DEFAULT FALSE,
  would_make_again BOOLEAN DEFAULT NULL,

  -- Moderation
  is_approved BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES auth.users(id),
  moderated_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,

  -- Engagement counters
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.recipe_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view approved reviews"
  ON public.recipe_reviews FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert reviews"
  ON public.recipe_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews (if not approved yet)"
  ON public.recipe_reviews FOR UPDATE
  USING (auth.uid() = user_id AND is_approved = false);

CREATE POLICY "Admins can approve/reject reviews"
  ON public.recipe_reviews FOR UPDATE
  USING (auth.uid() IN (
    SELECT id FROM auth.users
    WHERE raw_user_meta_data->>'role' = 'admin'
  ));

-- Indexes
CREATE INDEX idx_reviews_recipe ON public.recipe_reviews(recipe_slug);
CREATE INDEX idx_reviews_user ON public.recipe_reviews(user_id);
CREATE INDEX idx_reviews_approved ON public.recipe_reviews(is_approved, created_at DESC);
CREATE INDEX idx_reviews_helpful ON public.recipe_reviews(helpful_count DESC);

-- Updated_at trigger
CREATE TRIGGER update_recipe_reviews_updated_at
  BEFORE UPDATE ON public.recipe_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

**TypeScript Type:**
```typescript
export interface RecipeReview {
  id: string;
  recipe_slug: string;
  user_id: string;
  rating: number | null;
  title: string | null;
  content: string;
  images: string[] | null;
  made_modifications: boolean;
  would_make_again: boolean | null;
  is_approved: boolean;
  moderated_by: string | null;
  moderated_at: string | null;
  rejection_reason: string | null;
  helpful_count: number;
  not_helpful_count: number;
  created_at: string;
  updated_at: string;

  // Joined data (from query)
  profile?: Profile;
}
```

#### 4. Review Votes Table

```sql
-- Create review_votes table (helpful/not helpful)
CREATE TABLE public.review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.recipe_reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- One vote per user per review
  UNIQUE(review_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view votes"
  ON public.review_votes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.review_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change own vote"
  ON public.review_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove own vote"
  ON public.review_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_votes_review ON public.review_votes(review_id);
CREATE INDEX idx_votes_user ON public.review_votes(user_id);

-- Trigger to update review helpful counts
CREATE OR REPLACE FUNCTION public.update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.is_helpful THEN
      UPDATE public.recipe_reviews
      SET helpful_count = helpful_count + 1
      WHERE id = NEW.review_id;
    ELSE
      UPDATE public.recipe_reviews
      SET not_helpful_count = not_helpful_count + 1
      WHERE id = NEW.review_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.is_helpful != NEW.is_helpful THEN
      IF NEW.is_helpful THEN
        UPDATE public.recipe_reviews
        SET helpful_count = helpful_count + 1,
            not_helpful_count = not_helpful_count - 1
        WHERE id = NEW.review_id;
      ELSE
        UPDATE public.recipe_reviews
        SET helpful_count = helpful_count - 1,
            not_helpful_count = not_helpful_count + 1
        WHERE id = NEW.review_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.is_helpful THEN
      UPDATE public.recipe_reviews
      SET helpful_count = helpful_count - 1
      WHERE id = OLD.review_id;
    ELSE
      UPDATE public.recipe_reviews
      SET not_helpful_count = not_helpful_count - 1
      WHERE id = OLD.review_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_review_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.review_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_review_helpful_count();
```

**TypeScript Type:**
```typescript
export interface ReviewVote {
  id: string;
  review_id: string;
  user_id: string;
  is_helpful: boolean;
  created_at: string;
}
```

#### 5. Database Views (Computed Data)

```sql
-- View: Recipe Rating Stats (aggregated)
CREATE OR REPLACE VIEW recipe_rating_stats AS
SELECT
  recipe_slug,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating)::numeric, 2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star_count
FROM public.recipe_ratings
GROUP BY recipe_slug;

-- Grant access
GRANT SELECT ON recipe_rating_stats TO authenticated, anon;
```

**TypeScript Type:**
```typescript
export interface RecipeRatingStats {
  recipe_slug: string;
  total_ratings: number;
  average_rating: number;
  five_star_count: number;
  four_star_count: number;
  three_star_count: number;
  two_star_count: number;
  one_star_count: number;
}
```

### Supabase Storage Buckets

```sql
-- Create review-images bucket (via Supabase Dashboard)
-- Bucket name: review-images
-- Public: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- Storage RLS Policies
CREATE POLICY "Anyone can view review images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

CREATE POLICY "Authenticated users can upload review images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'review-images'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can delete own review images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'review-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## API Specification

### Supabase Client Setup

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Type-safe database types (auto-generated)
export type { Database } from './database.types';
```

### Authentication API

```typescript
// src/services/auth.service.ts
import { supabase } from '@/lib/supabase';

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  display_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp({ email, password, username, display_name }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: display_name || username
        }
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in existing user
   */
  async signIn({ email, password }: SignInData) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Get current user
   */
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
```

### Ratings API

```typescript
// src/services/rating.service.ts
import { supabase } from '@/lib/supabase';
import type { RecipeRating, RecipeRatingStats } from '@/types/database';

export const ratingService = {
  /**
   * Get rating stats for a recipe
   */
  async getRecipeStats(recipeSlug: string): Promise<RecipeRatingStats | null> {
    const { data, error } = await supabase
      .from('recipe_rating_stats')
      .select('*')
      .eq('recipe_slug', recipeSlug)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found
    return data;
  },

  /**
   * Get user's rating for a recipe
   */
  async getUserRating(recipeSlug: string, userId: string): Promise<RecipeRating | null> {
    const { data, error } = await supabase
      .from('recipe_ratings')
      .select('*')
      .eq('recipe_slug', recipeSlug)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Rate a recipe (insert or update)
   */
  async rateRecipe(recipeSlug: string, rating: number): Promise<RecipeRating> {
    const { data, error } = await supabase
      .from('recipe_ratings')
      .upsert({
        recipe_slug: recipeSlug,
        user_id: (await supabase.auth.getUser()).data.user!.id,
        rating
      }, {
        onConflict: 'recipe_slug,user_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete user's rating
   */
  async deleteRating(recipeSlug: string): Promise<void> {
    const { error } = await supabase
      .from('recipe_ratings')
      .delete()
      .eq('recipe_slug', recipeSlug)
      .eq('user_id', (await supabase.auth.getUser()).data.user!.id);

    if (error) throw error;
  },

  /**
   * Subscribe to real-time rating changes
   */
  subscribeToRecipeRatings(
    recipeSlug: string,
    callback: (payload: any) => void
  ) {
    return supabase
      .channel(`ratings:${recipeSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipe_ratings',
          filter: `recipe_slug=eq.${recipeSlug}`
        },
        callback
      )
      .subscribe();
  }
};
```

### Reviews API

```typescript
// src/services/review.service.ts
import { supabase } from '@/lib/supabase';
import type { RecipeReview } from '@/types/database';

export interface CreateReviewData {
  recipe_slug: string;
  rating: number;
  title?: string;
  content: string;
  images?: string[];
  made_modifications?: boolean;
  would_make_again?: boolean;
}

export interface ReviewFilters {
  rating?: number;
  sort?: 'recent' | 'helpful' | 'rating_high' | 'rating_low';
  limit?: number;
  offset?: number;
}

export const reviewService = {
  /**
   * Get reviews for a recipe
   */
  async getReviews(
    recipeSlug: string,
    filters: ReviewFilters = {}
  ): Promise<RecipeReview[]> {
    let query = supabase
      .from('recipe_reviews')
      .select(`
        *,
        profile:profiles(username, display_name, avatar_url)
      `)
      .eq('recipe_slug', recipeSlug)
      .eq('is_approved', true);

    // Filter by rating
    if (filters.rating) {
      query = query.eq('rating', filters.rating);
    }

    // Sort
    switch (filters.sort) {
      case 'helpful':
        query = query.order('helpful_count', { ascending: false });
        break;
      case 'rating_high':
        query = query.order('rating', { ascending: false });
        break;
      case 'rating_low':
        query = query.order('rating', { ascending: true });
        break;
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewData): Promise<RecipeReview> {
    const { data, error } = await supabase
      .from('recipe_reviews')
      .insert({
        ...reviewData,
        user_id: (await supabase.auth.getUser()).data.user!.id,
        is_approved: false // Requires moderation
      })
      .select(`
        *,
        profile:profiles(username, display_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Upload review image
   */
  async uploadReviewImage(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('review-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('review-images')
      .getPublicUrl(fileName);

    return publicUrl;
  },

  /**
   * Vote on review (helpful/not helpful)
   */
  async voteReview(reviewId: string, isHelpful: boolean): Promise<void> {
    const { error } = await supabase
      .from('review_votes')
      .upsert({
        review_id: reviewId,
        user_id: (await supabase.auth.getUser()).data.user!.id,
        is_helpful: isHelpful
      }, {
        onConflict: 'review_id,user_id'
      });

    if (error) throw error;
  },

  /**
   * Get user's vote on a review
   */
  async getUserVote(reviewId: string, userId: string): Promise<boolean | null> {
    const { data, error } = await supabase
      .from('review_votes')
      .select('is_helpful')
      .eq('review_id', reviewId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data?.is_helpful ?? null;
  }
};
```

---

## Component Architecture

### File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx (NEW)
│   │   ├── RegisterForm.jsx (NEW)
│   │   ├── AuthModal.jsx (NEW)
│   │   ├── ProtectedRoute.jsx (NEW)
│   │   └── UserMenu.jsx (NEW)
│   │
│   ├── ratings/
│   │   ├── StarRating.jsx (NEW) - Interactive star selector
│   │   ├── RatingDisplay.jsx (NEW) - Read-only star display
│   │   ├── RatingStats.jsx (NEW) - Average + breakdown
│   │   └── RateRecipeButton.jsx (NEW) - CTA to rate
│   │
│   ├── reviews/
│   │   ├── ReviewForm.jsx (NEW) - Submit review
│   │   ├── ReviewCard.jsx (NEW) - Single review display
│   │   ├── ReviewList.jsx (NEW) - List of reviews
│   │   ├── ReviewFilters.jsx (NEW) - Filter by rating, sort
│   │   ├── ReviewVoteButtons.jsx (NEW) - Helpful/Not helpful
│   │   └── ReviewImageUpload.jsx (NEW) - Image upload
│   │
│   ├── common/
│   │   ├── ErrorMessage.jsx (exists)
│   │   ├── LoadingSpinner.jsx (NEW)
│   │   └── Modal.jsx (NEW)
│   │
│   ├── RecipeCard.jsx (exists - enhance with ratings)
│   └── AudioPlayer.jsx (exists)
│
├── hooks/
│   ├── useAuth.js (NEW) - Auth state management
│   ├── useRating.js (NEW) - Rating mutations
│   ├── useReviews.js (NEW) - Reviews queries
│   └── useSupabaseQuery.js (NEW) - Generic Supabase hook
│
├── lib/
│   ├── supabase.ts (NEW) - Supabase client
│   └── database.types.ts (NEW) - Auto-generated types
│
├── services/
│   ├── auth.service.ts (NEW)
│   ├── rating.service.ts (NEW)
│   └── review.service.ts (NEW)
│
├── context/
│   └── AuthContext.jsx (NEW) - Global auth state
│
├── pages/
│   ├── EpisodePage.jsx (exists)
│   └── RecipePage.jsx (NEW) - Individual recipe view
│
└── utils/
    ├── validators.js (NEW) - Form validation
    └── formatters.js (NEW) - Date/number formatting
```

### Key Components Design

#### 1. AuthContext (Global State)

```jsx
// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { authService } from '@/services/auth.service';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authService.getSession().then(session => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    loading,
    signUp: authService.signUp,
    signIn: authService.signIn,
    signOut: authService.signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Tests Required:**
- ✅ Provides auth state to children
- ✅ Updates on sign in
- ✅ Updates on sign out
- ✅ Persists session on refresh

#### 2. StarRating Component (Interactive)

```jsx
// src/components/ratings/StarRating.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function StarRating({ value, onChange, readonly = false, size = 'md' }) {
  const [hover, setHover] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className="flex gap-1"
      role={readonly ? 'img' : 'radiogroup'}
      aria-label={readonly ? `Rating: ${value} out of 5 stars` : 'Rate this recipe'}
    >
      {stars.map((star) => {
        const filled = star <= (hover || value);

        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={`${sizeClasses[size]} transition-colors ${
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
            onClick={() => !readonly && onChange(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
            role={readonly ? 'presentation' : 'radio'}
            aria-checked={!readonly && star === value}
          >
            <svg
              fill={filled ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={filled ? 0 : 2}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

StarRating.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};
```

**Tests Required:**
- ✅ Renders 5 stars
- ✅ Highlights on hover
- ✅ Calls onChange with correct value
- ✅ Readonly mode prevents interaction
- ✅ Keyboard accessible (Space/Enter to select)

#### 3. RatingStats Component

```jsx
// src/components/ratings/RatingStats.jsx
import React from 'react';
import PropTypes from 'prop-types';
import RatingDisplay from './RatingDisplay';

export default function RatingStats({ stats }) {
  if (!stats || stats.total_ratings === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No ratings yet. Be the first to rate!
      </div>
    );
  }

  const { average_rating, total_ratings } = stats;
  const breakdown = [
    { stars: 5, count: stats.five_star_count },
    { stars: 4, count: stats.four_star_count },
    { stars: 3, count: stats.three_star_count },
    { stars: 2, count: stats.two_star_count },
    { stars: 1, count: stats.one_star_count }
  ];

  return (
    <div className="space-y-4">
      {/* Average Rating */}
      <div className="flex items-center gap-4">
        <div className="text-4xl font-bold">{average_rating.toFixed(1)}</div>
        <div>
          <RatingDisplay value={average_rating} size="lg" />
          <div className="text-sm text-gray-600 mt-1">
            {total_ratings} {total_ratings === 1 ? 'rating' : 'ratings'}
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="space-y-2">
        {breakdown.map(({ stars, count }) => {
          const percentage = (count / total_ratings) * 100;

          return (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm w-8">{stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                  role="progressbar"
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${stars} stars: ${count} ratings`}
                />
              </div>
              <span className="text-sm text-gray-600 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

RatingStats.propTypes = {
  stats: PropTypes.shape({
    average_rating: PropTypes.number.isRequired,
    total_ratings: PropTypes.number.isRequired,
    five_star_count: PropTypes.number.isRequired,
    four_star_count: PropTypes.number.isRequired,
    three_star_count: PropTypes.number.isRequired,
    two_star_count: PropTypes.number.isRequired,
    one_star_count: PropTypes.number.isRequired
  })
};
```

**Tests Required:**
- ✅ Shows "No ratings" when empty
- ✅ Displays average rating
- ✅ Shows rating breakdown bars
- ✅ Calculates percentages correctly
- ✅ Accessible progress bars

#### 4. ReviewForm Component

```jsx
// src/components/reviews/ReviewForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '@/context/AuthContext';
import StarRating from '@/components/ratings/StarRating';
import ReviewImageUpload from './ReviewImageUpload';

export default function ReviewForm({ recipeSlug, onSubmit, onCancel }) {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    content: '',
    images: [],
    made_modifications: false,
    would_make_again: null
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    if (formData.content.trim().length < 10) {
      setError('Review must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({ ...formData, recipe_slug: recipeSlug });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600 mb-4">
          Please sign in to leave a review
        </p>
        <button className="btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <StarRating
          value={formData.rating}
          onChange={(rating) => setFormData({ ...formData, rating })}
          size="lg"
        />
      </div>

      {/* Title */}
      <div>
        <label htmlFor="review-title" className="block text-sm font-medium mb-2">
          Review Title (Optional)
        </label>
        <input
          id="review-title"
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Best chocolate chip cookies ever!"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          maxLength={255}
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="review-content" className="block text-sm font-medium mb-2">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="review-content"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Share your experience with this recipe..."
          rows={5}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          minLength={10}
          maxLength={2000}
        />
        <div className="text-sm text-gray-500 mt-1">
          {formData.content.length} / 2000 characters
        </div>
      </div>

      {/* Image Upload */}
      <ReviewImageUpload
        images={formData.images}
        onChange={(images) => setFormData({ ...formData, images })}
      />

      {/* Checkboxes */}
      <div className="space-y-3">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.made_modifications}
            onChange={(e) => setFormData({ ...formData, made_modifications: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">I made modifications to this recipe</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.would_make_again === true}
            onChange={(e) => setFormData({
              ...formData,
              would_make_again: e.target.checked ? true : null
            })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm">I would make this recipe again</span>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary flex-1"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Moderation Notice */}
      <p className="text-sm text-gray-500 text-center">
        Your review will be visible after moderation (usually within 24 hours)
      </p>
    </form>
  );
}

ReviewForm.propTypes = {
  recipeSlug: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};
```

**Tests Required:**
- ✅ Shows login prompt when not authenticated
- ✅ Validates rating selection
- ✅ Validates minimum content length
- ✅ Character counter updates
- ✅ Image upload works
- ✅ Calls onSubmit with correct data
- ✅ Shows error messages
- ✅ Disables submit while submitting

---

## Implementation Phases

### Phase 1: Supabase Setup + Authentication (Week 1)

#### Day 1: Supabase Project Setup
**Tasks:**
- [ ] Create Supabase project (`sunday-brunch-reviews`)
- [ ] Configure authentication providers (email/password)
- [ ] Create database schema (profiles, ratings, reviews, votes)
- [ ] Set up Row Level Security policies
- [ ] Create Storage bucket (review-images)
- [ ] Generate TypeScript types
- [ ] Configure environment variables

**Deliverables:**
- ✅ Supabase project live
- ✅ Database schema deployed
- ✅ RLS policies tested
- ✅ `.env` file with Supabase credentials

**Tests:**
- ✅ Can create user via Supabase Dashboard
- ✅ RLS prevents unauthorized access
- ✅ Storage bucket accepts images

#### Day 2-3: Authentication UI
**Tasks:**
- [ ] Create AuthContext provider
- [ ] Build LoginForm component (15+ tests)
- [ ] Build RegisterForm component (15+ tests)
- [ ] Create AuthModal wrapper
- [ ] Add UserMenu component (dropdown)
- [ ] Implement session persistence
- [ ] Add loading states

**Deliverables:**
- ✅ Login/Register forms functional
- ✅ Auth state persists on refresh
- ✅ User menu shows current user
- ✅ 30+ auth tests passing

**Tests:**
- ✅ Login with valid credentials
- ✅ Login with invalid credentials (error)
- ✅ Registration creates user
- ✅ Duplicate email shows error
- ✅ Session persists after refresh
- ✅ Logout clears session

#### Day 4: Protected Routes
**Tasks:**
- [ ] Create ProtectedRoute component
- [ ] Add auth guards to recipe pages
- [ ] Redirect to login when needed
- [ ] Add "Sign in to rate" prompts
- [ ] Test unauthorized access

**Deliverables:**
- ✅ Protected routes work
- ✅ Redirects preserve destination
- ✅ Clear UX for unauthenticated users

**Tests:**
- ✅ Redirects to login when not authenticated
- ✅ Allows access when authenticated
- ✅ Redirects back after login

#### Day 5: Testing + Polish
**Tasks:**
- [ ] Write integration tests (auth flow)
- [ ] Test error scenarios
- [ ] Add loading skeletons
- [ ] Accessibility audit (forms)
- [ ] Fix any bugs

**Deliverables:**
- ✅ 40+ auth tests passing
- ✅ Zero critical bugs
- ✅ WCAG 2.1 AA compliant

---

### Phase 2: Ratings System (Week 2)

#### Day 1: Rating Backend Integration
**Tasks:**
- [ ] Create rating.service.ts
- [ ] Build useRating hook
- [ ] Test Supabase queries
- [ ] Set up real-time subscriptions
- [ ] Test RLS policies

**Deliverables:**
- ✅ Rating service functional
- ✅ Real-time updates working
- ✅ 10+ service tests

**Tests:**
- ✅ Can rate recipe (insert)
- ✅ Can update rating (upsert)
- ✅ One rating per user enforced
- ✅ Rating stats calculated correctly
- ✅ Real-time subscription fires

#### Day 2-3: Rating Components
**Tasks:**
- [ ] Build StarRating component (15+ tests)
- [ ] Build RatingDisplay component (read-only)
- [ ] Build RatingStats component (15+ tests)
- [ ] Build RateRecipeButton component
- [ ] Add optimistic updates
- [ ] Test on RecipeCard

**Deliverables:**
- ✅ All rating components functional
- ✅ Optimistic UI updates
- ✅ 40+ component tests

**Tests:**
- ✅ StarRating renders 5 stars
- ✅ Hover highlights stars
- ✅ Click updates rating
- ✅ RatingStats shows breakdown
- ✅ Optimistic update on rate

#### Day 4: Integration + Real-time
**Tasks:**
- [ ] Integrate ratings into RecipeCard
- [ ] Add real-time updates
- [ ] Test concurrent ratings
- [ ] Add loading states
- [ ] Test offline scenarios

**Deliverables:**
- ✅ Ratings live on recipe pages
- ✅ Real-time updates working
- ✅ Graceful offline handling

**Tests:**
- ✅ Rating updates in real-time
- ✅ Multiple users see same data
- ✅ Offline shows cached data

#### Day 5: Testing + Polish
**Tasks:**
- [ ] Write integration tests
- [ ] Test edge cases (no ratings yet)
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Bug fixes

**Deliverables:**
- ✅ 60+ rating tests passing
- ✅ Zero critical bugs
- ✅ WCAG 2.1 AA compliant

---

### Phase 3: Reviews System (Week 3)

#### Day 1-2: Review Submission
**Tasks:**
- [ ] Create review.service.ts
- [ ] Build ReviewForm component (20+ tests)
- [ ] Add form validation
- [ ] Test review creation
- [ ] Add moderation workflow

**Deliverables:**
- ✅ Review submission works
- ✅ Reviews require moderation
- ✅ 25+ component tests

**Tests:**
- ✅ Form validates required fields
- ✅ Submit creates review
- ✅ Review pending approval
- ✅ Error handling works

#### Day 3-4: Review Display + Filtering
**Tasks:**
- [ ] Build ReviewCard component (15+ tests)
- [ ] Build ReviewList component (15+ tests)
- [ ] Build ReviewFilters component (10+ tests)
- [ ] Add sorting (recent, helpful, rating)
- [ ] Add pagination
- [ ] Build ReviewVoteButtons (10+ tests)

**Deliverables:**
- ✅ Reviews display correctly
- ✅ Filtering/sorting works
- ✅ Pagination works
- ✅ 50+ component tests

**Tests:**
- ✅ ReviewCard displays review data
- ✅ Filters by rating
- ✅ Sorts correctly
- ✅ Pagination loads more
- ✅ Vote buttons work

#### Day 5: Testing + Polish
**Tasks:**
- [ ] Integration tests (review flow)
- [ ] Test moderation states
- [ ] Accessibility audit
- [ ] Bug fixes

**Deliverables:**
- ✅ 80+ review tests passing
- ✅ Zero critical bugs
- ✅ WCAG 2.1 AA compliant

---

### Phase 4: Image Uploads + Polish (Week 4)

#### Day 1-2: Review Image Uploads
**Tasks:**
- [ ] Build ReviewImageUpload component (15+ tests)
- [ ] Implement file upload to Supabase Storage
- [ ] Add image preview
- [ ] Add image validation (size, type)
- [ ] Test upload errors
- [ ] Add image gallery in ReviewCard

**Deliverables:**
- ✅ Image upload works
- ✅ Images display in reviews
- ✅ 20+ upload tests

**Tests:**
- ✅ Upload accepts valid images
- ✅ Rejects invalid files
- ✅ Shows preview
- ✅ Deletes images
- ✅ Multiple uploads work

#### Day 3: Moderation UI (Admin)
**Tasks:**
- [ ] Build admin review moderation page
- [ ] Add approve/reject actions
- [ ] Add bulk moderation
- [ ] Test RLS (admin-only access)

**Deliverables:**
- ✅ Moderation interface works
- ✅ Only admins can access
- ✅ 10+ moderation tests

**Tests:**
- ✅ Admin can approve reviews
- ✅ Admin can reject reviews
- ✅ Non-admin blocked from moderation

#### Day 4-5: Final Testing + Fixes
**Tasks:**
- [ ] E2E tests (full review flow)
- [ ] Performance optimization
- [ ] Accessibility final audit
- [ ] Cross-browser testing
- [ ] Bug fixes
- [ ] Documentation

**Deliverables:**
- ✅ 120+ total tests passing
- ✅ Zero critical bugs
- ✅ Production-ready code
- ✅ Documentation complete

**Tests:**
- ✅ E2E: Sign up → Rate → Review
- ✅ E2E: Image upload → Moderation → Display
- ✅ Performance: Page load <2s
- ✅ Accessibility: WCAG 2.1 AA

---

## Testing Strategy

### Test Coverage Goals

| Layer | Tool | Target Coverage | Test Count |
|-------|------|----------------|-----------|
| **Services** | Vitest | 90%+ | 30 tests |
| **Components** | Vitest + RTL | 85%+ | 90 tests |
| **Integration** | Vitest + Supabase | 80%+ | 20 tests |
| **E2E** | Playwright | Critical paths | 10 tests |
| **TOTAL** | | **85%+** | **150 tests** |

### TDD Workflow (Red-Green-Refactor)

```bash
# 1. RED: Write failing test
npm run test:watch

# 2. GREEN: Implement minimum code
# 3. REFACTOR: Clean up
# 4. VERIFY: Run all tests
npm run test:coverage
```

### Test Patterns

#### 1. Supabase Service Tests

```javascript
// tests/services/rating.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ratingService } from '@/services/rating.service';
import { supabase } from '@/lib/supabase';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn()
    }
  }
}));

describe('ratingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRecipeStats', () => {
    it('should fetch rating stats for a recipe', async () => {
      const mockStats = {
        recipe_slug: 'chocolate-chip-cookies',
        total_ratings: 10,
        average_rating: 4.5,
        five_star_count: 6,
        four_star_count: 3,
        three_star_count: 1,
        two_star_count: 0,
        one_star_count: 0
      };

      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockStats, error: null })
          })
        })
      });

      const stats = await ratingService.getRecipeStats('chocolate-chip-cookies');

      expect(stats).toEqual(mockStats);
      expect(supabase.from).toHaveBeenCalledWith('recipe_rating_stats');
    });

    it('should return null if no stats found', async () => {
      supabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116' } // Not found
            })
          })
        })
      });

      const stats = await ratingService.getRecipeStats('new-recipe');
      expect(stats).toBeNull();
    });
  });

  describe('rateRecipe', () => {
    it('should upsert a rating', async () => {
      const mockUser = { id: 'user-123' };
      supabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });

      const mockRating = {
        id: 'rating-1',
        recipe_slug: 'chocolate-chip-cookies',
        user_id: 'user-123',
        rating: 5
      };

      supabase.from.mockReturnValue({
        upsert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockRating, error: null })
          })
        })
      });

      const rating = await ratingService.rateRecipe('chocolate-chip-cookies', 5);

      expect(rating).toEqual(mockRating);
      expect(supabase.from).toHaveBeenCalledWith('recipe_ratings');
    });
  });
});
```

#### 2. Component Tests with Auth Context

```javascript
// tests/components/ReviewForm.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from '@/components/reviews/ReviewForm';
import { AuthProvider } from '@/context/AuthContext';

// Mock auth context
const mockAuthContext = {
  user: { id: 'user-123', email: 'test@example.com' },
  isAuthenticated: true
};

vi.mock('@/context/AuthContext', () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockAuthContext
}));

describe('ReviewForm', () => {
  it('should require authentication to submit', () => {
    mockAuthContext.isAuthenticated = false;

    render(<ReviewForm recipeSlug="test-recipe" onSubmit={vi.fn()} />);

    expect(screen.getByText(/please sign in/i)).toBeInTheDocument();
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('should validate rating selection', async () => {
    mockAuthContext.isAuthenticated = true;
    const onSubmit = vi.fn();

    render(<ReviewForm recipeSlug="test-recipe" onSubmit={onSubmit} />);

    const submitButton = screen.getByText(/submit review/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please select a rating/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should submit valid review', async () => {
    mockAuthContext.isAuthenticated = true;
    const onSubmit = vi.fn().mockResolvedValue({});

    render(<ReviewForm recipeSlug="test-recipe" onSubmit={onSubmit} />);

    // Select rating
    const fiveStarButton = screen.getByLabelText(/5 stars/i);
    fireEvent.click(fiveStarButton);

    // Enter content
    const contentTextarea = screen.getByLabelText(/your review/i);
    fireEvent.change(contentTextarea, {
      target: { value: 'This recipe is amazing! Highly recommend.' }
    });

    // Submit
    const submitButton = screen.getByText(/submit review/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        recipe_slug: 'test-recipe',
        rating: 5,
        title: '',
        content: 'This recipe is amazing! Highly recommend.',
        images: [],
        made_modifications: false,
        would_make_again: null
      });
    });
  });
});
```

#### 3. E2E Tests (Playwright)

```javascript
// tests/e2e/review-submission.spec.js
import { test, expect } from '@playwright/test';

test.describe('Review Submission Flow', () => {
  test('user can sign up, rate, and review a recipe', async ({ page }) => {
    // Step 1: Navigate to recipe page
    await page.goto('/recipes/chocolate-chip-cookies');

    // Step 2: Click "Sign Up" (should show modal)
    await page.click('text=Sign In');
    await page.click('text=Create Account');

    // Step 3: Register new account
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'SecurePass123!');
    await page.fill('[name="username"]', 'testuser');
    await page.click('button[type="submit"]');

    // Wait for redirect
    await page.waitForURL('**/recipes/**');

    // Step 4: Rate recipe (5 stars)
    await page.click('[aria-label="5 stars"]');

    // Wait for optimistic update
    await expect(page.locator('text=Your rating: 5 stars')).toBeVisible();

    // Step 5: Write review
    await page.click('text=Write a Review');
    await page.fill('[name="content"]', 'These cookies are incredible! Perfect texture and flavor.');
    await page.check('[name="would_make_again"]');

    // Step 6: Submit review
    await page.click('button:has-text("Submit Review")');

    // Wait for success message
    await expect(page.locator('text=Review submitted successfully')).toBeVisible();
    await expect(page.locator('text=Your review will be visible after moderation')).toBeVisible();

    // Step 7: Verify review appears in "Your Reviews" (pending)
    await page.click('text=Your Reviews');
    await expect(page.locator('text=These cookies are incredible')).toBeVisible();
    await expect(page.locator('text=Pending Approval')).toBeVisible();
  });

  test('admin can moderate reviews', async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.fill('[name="email"]', 'admin@sundaybrunch.com');
    await page.fill('[name="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');

    // Navigate to moderation page
    await page.goto('/admin/reviews');

    // Approve first review
    await page.click('[data-testid="approve-review-btn"]');

    // Verify success
    await expect(page.locator('text=Review approved')).toBeVisible();
  });
});
```

---

## Risk Analysis & Mitigation

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Supabase RLS misconfiguration** | Medium | Critical | - Comprehensive RLS tests<br>- Manual security audit<br>- Test with multiple user roles |
| **Image upload abuse** | High | Medium | - File size limit (5MB)<br>- File type validation<br>- Rate limiting (5 uploads/hour)<br>- Manual review of all images |
| **Spam reviews** | High | Medium | - Manual moderation required<br>- Rate limiting (1 review/recipe/user)<br>- Content length validation |
| **Real-time subscription performance** | Low | Medium | - Debounce updates (500ms)<br>- Limit subscriptions to current page<br>- Fallback to polling |
| **Auth token expiration issues** | Medium | Medium | - Auto-refresh tokens<br>- Clear error messages<br>- Graceful session recovery |

### Product Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Low review submission rate** | Medium | Medium | - Incentivize first review (badge)<br>- Email reminders<br>- Prominent CTAs |
| **Negative reviews** | Low | High | - Respond professionally<br>- Show improvement<br>- Balance with positive content |
| **Moderation bottleneck** | Medium | High | - Email notifications for new reviews<br>- Bulk approve tools<br>- Consider auto-approval for trusted users |

### Security Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **SQL injection (via Supabase)** | Very Low | Critical | - Supabase uses parameterized queries<br>- Never use raw SQL from user input |
| **XSS in review content** | Medium | High | - Sanitize all user input<br>- Use React's built-in XSS protection<br>- Content Security Policy headers |
| **Unauthorized data access** | Medium | Critical | - Row Level Security enforced<br>- Test with multiple user accounts<br>- Security audit before launch |
| **Account takeover** | Low | High | - Strong password requirements<br>- Email verification (future)<br>- 2FA (future) |

---

## Success Metrics

### Week 1 (Auth Complete)
- ✅ 40+ auth tests passing
- ✅ Users can sign up/sign in
- ✅ Session persistence works
- ✅ Protected routes functional
- ✅ Zero critical security issues

### Week 2 (Ratings Complete)
- ✅ 60+ rating tests passing
- ✅ Users can rate recipes
- ✅ Real-time updates working
- ✅ Rating stats display correctly
- ✅ Optimistic updates functional

### Week 3 (Reviews Complete)
- ✅ 80+ review tests passing
- ✅ Users can submit reviews
- ✅ Reviews display with filtering
- ✅ Helpful votes work
- ✅ Moderation workflow functional

### Week 4 (Polish Complete)
- ✅ 120+ total tests passing
- ✅ Image uploads work
- ✅ Admin moderation UI complete
- ✅ WCAG 2.1 AA compliant
- ✅ Zero critical bugs

### Sprint 3 Success Criteria

**Technical:**
- ✅ 85%+ test coverage
- ✅ 150+ tests passing
- ✅ Zero TypeScript errors
- ✅ Zero console warnings
- ✅ Lighthouse score >90
- ✅ WCAG 2.1 AA compliant

**Functional:**
- ✅ User registration/login works
- ✅ Users can rate recipes (1-5 stars)
- ✅ Users can write reviews
- ✅ Reviews require moderation
- ✅ Image uploads functional
- ✅ Real-time rating updates
- ✅ Helpful/not helpful votes

**User Experience:**
- ✅ Intuitive auth flow
- ✅ Clear moderation messaging
- ✅ Responsive design (mobile + desktop)
- ✅ Loading states for all actions
- ✅ Error messages helpful

### Post-Sprint 3 Goals (30 days)

**Engagement:**
- 🎯 50+ user accounts created
- 🎯 100+ recipe ratings
- 🎯 20+ approved reviews
- 🎯 5+ reviews with photos

**Technical:**
- 🎯 Average page load <2s
- 🎯 Zero production errors
- 🎯 Supabase costs <$10/month

---

## Migration Path

### From Static to Dynamic Site

#### Current Architecture
```
website/
├── src/
│   ├── components/
│   │   ├── RecipeCard.jsx (static)
│   │   └── AudioPlayer.jsx
│   └── pages/
│       └── EpisodePage.jsx
└── data/ (static JSON)
```

#### After Sprint 3
```
website/
├── src/
│   ├── components/
│   │   ├── RecipeCard.jsx (enhanced with ratings)
│   │   ├── auth/ (NEW)
│   │   ├── ratings/ (NEW)
│   │   └── reviews/ (NEW)
│   ├── lib/
│   │   └── supabase.ts (NEW)
│   ├── services/ (NEW)
│   ├── context/ (NEW)
│   └── hooks/ (NEW)
└── data/ (static JSON + Supabase)
```

### Migration Strategy

**Phase 1: Parallel Systems**
- ✅ Static recipe data remains (no migration needed)
- ✅ Supabase handles only user-generated content
- ✅ Recipe slugs link static data to Supabase

**Phase 2: Enhanced Components**
- ✅ RecipeCard shows static data + live ratings
- ✅ New RecipePage component integrates both
- ✅ No breaking changes to existing features

**Phase 3: Future Migration (Sprint 4+)**
- ❌ Migrate static recipes to Supabase (optional)
- ❌ Add recipe management UI (admin only)
- ❌ Enable recipe versioning

### Data Flow

```
User Opens Recipe Page
         ↓
[Static JSON] → Recipe Content (title, ingredients, steps)
         ↓
[Supabase] → Rating Stats (average, breakdown)
         ↓
[Supabase] → User's Rating (if authenticated)
         ↓
[Supabase] → Reviews (approved only)
         ↓
Render Complete Page
```

### Environment Configuration

```bash
# .env (add these)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Netlify Deployment:**
- Add environment variables in Netlify Dashboard
- No build changes needed (Vite handles env vars)
- Deploy as normal (`git push`)

---

## Appendix

### Supabase Costs

| Tier | Users | Storage | Bandwidth | Cost/Month |
|------|-------|---------|-----------|-----------|
| **Free** | 0-500 | 500MB | 2GB | $0 |
| **Pro** | 500-10k | 8GB | 50GB | $25 |
| **Team** | 10k+ | 100GB | 250GB | $599 |

**Estimated Sprint 3 Usage:**
- Users: <100
- Storage: <100MB (review images)
- Bandwidth: <500MB
- **Cost: $0/month** ✅

### Alternative Approaches Considered

#### 1. Custom Backend (Express + PostgreSQL)
**Pros:** Full control, no vendor lock-in
**Cons:** 80+ hours development, $27+/month hosting
**Verdict:** ❌ Not worth it for MVP

#### 2. Firebase
**Pros:** Similar to Supabase, Google backing
**Cons:** NoSQL (less familiar), vendor lock-in
**Verdict:** ❌ Supabase better for SQL

#### 3. Serverless Functions (Netlify Functions)
**Pros:** Simple, integrated with Netlify
**Cons:** No database, no auth, manual everything
**Verdict:** ❌ Too limited for reviews

### Learning Resources

**Supabase:**
- Official Docs: https://supabase.com/docs
- React Quick Start: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- Auth Helpers: https://supabase.com/docs/guides/auth/auth-helpers

**Testing:**
- Vitest Docs: https://vitest.dev/
- React Testing Library: https://testing-library.com/react
- Playwright Docs: https://playwright.dev/

**Accessibility:**
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- axe DevTools: https://www.deque.com/axe/devtools/

---

## Approval Checklist

Before proceeding with Sprint 3 implementation:

### Technical Decisions
- [ ] Supabase as backend (vs custom Express)
- [ ] Row-Level Security for data protection
- [ ] Manual moderation for all reviews
- [ ] Real-time subscriptions for ratings
- [ ] Supabase Storage for review images

### Product Decisions
- [ ] NO user-submitted recipes (owner only)
- [ ] Email/password only (no OAuth for MVP)
- [ ] Reviews require manual approval
- [ ] Helpful/not helpful voting enabled
- [ ] Image uploads allowed (max 5MB, 5 images/review)

### Timeline & Resources
- [ ] 3-4 week timeline approved
- [ ] Solo development confirmed
- [ ] Budget: $0/month Supabase free tier
- [ ] Daily progress tracking

### Success Metrics
- [ ] 85%+ test coverage minimum
- [ ] 150+ tests target
- [ ] WCAG 2.1 AA compliance
- [ ] Zero critical bugs at launch

---

**Document Status:** Ready for Review
**Next Steps:** Team review → Approval → Begin Week 1
**Owner:** Development Team
**Last Updated:** 2026-01-07
