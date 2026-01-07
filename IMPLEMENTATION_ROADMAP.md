# Sunday Brunch with Giselle - Implementation Roadmap

**Version:** 2.0
**Created:** 2026-01-06
**Last Updated:** 2026-01-07
**Status:** Active Development - Sprint 2 Complete ✅
**Approach:** Test-Driven Development (TDD)
**Target:** Transform static site into competitive full-stack recipe platform

---

## 🎉 Completed Sprints (Actual Implementation)

### ✅ Sprint 1: Advanced Search & Discovery (Week 1)
**Status:** Complete | **Grade:** A- (92/100) | **Tests:** 149/149 passing

**Completed:**
- [x] SearchBar component with fuzzy search (Fuse.js)
- [x] RecipeFilters component (7 filter categories, 40+ options)
- [x] SearchResults component with grid layout
- [x] useRecipeSearch custom hook with filtering logic
- [x] Enhanced RecipeIndexPage integration
- [x] Mobile-responsive design with filter drawer
- [x] WCAG 2.1 AA accessibility compliance
- [x] 59 comprehensive tests (100% pass rate)
- [x] Fixed 2 critical security issues (XSS, memory leak)
- [x] Fixed 5 quick-win accessibility issues (Phase 1)
- [x] Fixed 9 remaining issues for zero tech debt (Phase 2)
  - [x] Fixed debounce sync issue (no input lag)
  - [x] Implemented functional pagination
  - [x] Fixed keyboard shortcut conflicts (/ key)
  - [x] Added Escape key + focus trap for mobile drawer
  - [x] Extracted hardcoded filter options to config
  - [x] Added error boundary for search failures
  - [x] Added error handling for recipe loading
  - [x] Added PropTypes validation to all components
  - [x] Cached Fuse.js instance for performance

**Deliverables:**
- Client-side search (no backend needed)
- Category, dietary, season, difficulty, time, tag filters
- Sort by newest, alphabetical, cook time
- Mobile FAB with slide-out drawer
- Keyboard shortcuts (/ key for focus, Escape to close)
- Functional pagination with page navigation
- Comprehensive error handling
- Production-ready code quality

---

### ✅ Sprint 2: Nutritional Information (Week 2)
**Status:** Complete | **Grade:** A- (91/100) | **Tests:** 149/149 passing

**Completed:**
- [x] NutritionFacts component (FDA 2016 compliant)
- [x] DietaryBadges component (12 dietary types)
- [x] AllergenWarnings component (FDA Big 8 + Sesame)
- [x] RecipeTemplate integration with schema.org markup
- [x] RecipeCalculator sync for nutrition scaling
- [x] 90 comprehensive nutrition tests
- [x] PropTypes validation for type safety
- [x] Fixed all 13 code review issues (P0, P1, P2, P3)
- [x] WCAG 2.1 AA accessibility compliance
- [x] Print-friendly nutrition labels

**Deliverables:**
- FDA-compliant nutrition facts display
- Color-coded dietary restriction badges
- High-visibility allergen warnings
- Auto-scaling with serving size
- SEO-optimized schema markup
- User data template for nutrition input

---

## Overall Project Status

| Metric | Sprint 1 | Sprint 2 | Total |
|--------|----------|----------|-------|
| **Tests Passing** | 59 | 90 | 149 |
| **Test Pass Rate** | 100% | 100% | 100% |
| **Grade** | A- (92%) ⬆️ | A- (91%) | A- (91.5%) |
| **Components** | 4 + ErrorBoundary | 3 | 8 |
| **Coverage** | 100% | 100% | 100% |
| **Critical Issues** | 0 | 0 | 0 |
| **P1/P2 Issues** | 0 (all fixed) | 0 (all fixed) | 0 |
| **Technical Debt** | 0% ✅ | 0% ✅ | 0% ✅ |
| **Development Time** | ~27.5 hours | ~24 hours | ~51.5 hours |

---

## Revised Implementation Timeline

**Original Plan:** 12-16 weeks (backend-first approach)
**Actual Plan:** Static-first with incremental backend integration

**Completed (Weeks 1-2):**
- ✅ Sprint 1: Advanced Search (client-side)
- ✅ Sprint 2: Nutritional Information

**Next Priority (Weeks 3-4):**
- Sprint 3: User Reviews & Ratings (requires Supabase backend)
- Sprint 4: User Authentication (Supabase Auth)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Technical Architecture Decisions](#technical-architecture-decisions)
4. [Database Schema Design](#database-schema-design)
5. [API Specification](#api-specification)
6. [Frontend Architecture](#frontend-architecture)
7. [Implementation Phases](#implementation-phases)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Plan](#deployment-plan)
10. [Risk Analysis](#risk-analysis)
11. [Success Metrics](#success-metrics)
12. [Open Questions](#open-questions)

---

## Executive Summary

### Goal
Transform Sunday Brunch with Giselle from a static recipe showcase into a competitive full-stack platform with user engagement, monetization, and community features.

### Critical Missing Features
- ❌ User reviews & ratings system
- ✅ Advanced search & discovery **(Sprint 1 Complete)**
- ❌ User accounts & personalization
- ❌ Comments system
- ✅ Nutritional information **(Sprint 2 Complete)**
- ❌ Monetization features (Affiliates, Ko-fi, Digital Products)

### Timeline
**12-16 weeks** for MVP deployment (5 phases)

### Budget Estimate
- **Infrastructure:** $50-115/month
- **Development Time:** 1000+ hours (solo) or 12 weeks (team of 5-6)
- **Professional Launch:** $50,000-100,000 total investment

### Success Metrics (6 months)
- 10,000+ registered users
- 5,000+ recipe reviews
- 1,000+ rated recipes
- $8,500/month revenue

---

## Current State Analysis

### ✅ Strengths
1. **Unique Brand Identity**
   - Whimsical Sheltie characters (Giselle, Muffin, Biscuit, Crumpet)
   - Strong storytelling in recipes
   - Distinctive visual style

2. **Technical Foundation**
   - React + Vite (fast, modern)
   - Mobile responsive
   - SEO optimized (recipe schema)
   - Analytics tracking

3. **Innovative Features**
   - Alchemist's Lab (recipe experimentation)
   - Recipe Calculator (scaling)
   - Achievement system
   - Sheltie Soundboard
   - Interactive animations

### Competitive Gaps

| Feature Category | Before | After Sprints 1-2 | Competitor Average | Gap |
|-----------------|--------|-------------------|-------------------|-----|
| Search & Discovery | 2/10 | **8/10 ✅** | 8/10 | **0** (Closed!) |
| Nutrition Information | 0/10 | **9/10 ✅** | 7/10 | **+2** (Ahead!) |
| User Engagement | 3/10 | 3/10 | 7/10 | **-4** |
| Monetization | 1/10 | 1/10 | 7/10 | **-6** |
| Social Features | 2/10 | 2/10 | 7/10 | **-5** |

---

## Technical Architecture Decisions

### Decision Matrix

#### 1. Authentication Strategy
**DECISION: JWT + httpOnly Cookies (Hybrid)**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| JWT Only | Stateless, scalable | XSS vulnerable | ❌ |
| Session Only | More secure | Not scalable | ❌ |
| **JWT + httpOnly** | **Secure + scalable** | **More complex** | ✅ **SELECTED** |
| OAuth Only | Easy UX | Vendor lock-in | ❌ |

**Implementation:**
- Access token (JWT, 15min expiry) in memory
- Refresh token (httpOnly cookie, 7 days)
- Optional OAuth (Google, Facebook)

#### 2. Database Choice
**DECISION: PostgreSQL 15+**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **PostgreSQL** | **ACID, FTS, JSONB** | **Learning curve** | ✅ **SELECTED** |
| MySQL | Familiar | Limited JSON | ❌ |
| MongoDB | Flexible schema | No ACID | ❌ |
| Firebase | Fast setup | Vendor lock-in | ❌ |

**Features Used:**
- Full-text search (tsvector)
- JSONB for flexible data (ingredients, nutrition)
- Materialized views for performance
- Row-level security

#### 3. Backend Framework
**DECISION: Node.js + Express**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Express** | **Minimal, flexible** | **Manual setup** | ✅ **SELECTED** |
| Fastify | Fast | Less ecosystem | ⚠️ Alternative |
| NestJS | Enterprise ready | Heavy | ❌ |
| Next.js API | Same language | Vercel lock-in | ❌ |

**Stack:**
- Express 4.18+
- TypeScript
- Prisma ORM (type-safe queries)
- Node.js 20 LTS

#### 4. State Management
**DECISION: React Query + Context API**

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **React Query + Context** | **Server/client split** | **Two systems** | ✅ **SELECTED** |
| Redux Toolkit | Mature, predictable | Boilerplate | ❌ |
| Zustand | Simple | Manual async | ❌ |
| Jotai | Modern | Less proven | ❌ |

**Usage:**
- React Query: Server state (recipes, reviews, users)
- Context API: Client state (theme, UI preferences)

#### 5. Search Implementation
**DECISION: PostgreSQL FTS → Elasticsearch (future)**

**Phase 1:** PostgreSQL Full-Text Search
- Good enough for <100,000 recipes
- No additional infrastructure
- Free

**Phase 2:** Elasticsearch (when needed)
- Better relevance scoring
- Advanced filters
- Requires $50+/month

#### 6. Hosting & Deployment
**DECISION: Vercel (frontend) + DigitalOcean (backend)**

| Component | Provider | Cost | Justification |
|-----------|----------|------|---------------|
| Frontend | **Vercel** | $0-20/mo | Free tier, excellent DX |
| Backend API | **DigitalOcean App Platform** | $12/mo | Managed, easy scaling |
| Database | **DigitalOcean Managed PostgreSQL** | $15/mo | Automated backups |
| Redis Cache | **Upstash** | $0-10/mo | Serverless, pay-per-use |
| CDN | **CloudFlare** | $0 | Free plan sufficient |
| **TOTAL** | | **$27-57/mo** | MVP pricing |

---

## Database Schema Design

### Core Tables (14 tables)

#### Users & Authentication
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'user', -- user, premium, moderator, admin
  email_verified BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

-- Social OAuth providers
CREATE TABLE oauth_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL, -- google, facebook
  provider_user_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_user_id)
);

-- Refresh tokens for authentication
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
```

#### Recipes & Content
```sql
-- Recipes table (extended from current system)
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  story TEXT[], -- Keep whimsical storytelling
  image_url TEXT,

  -- Recipe metadata
  prep_time_minutes INT,
  cook_time_minutes INT,
  total_time_minutes INT,
  servings INT,
  difficulty VARCHAR(20), -- easy, medium, hard

  -- Ingredients (JSONB for flexibility)
  ingredients JSONB NOT NULL, -- [{ amount, unit, name, notes }]
  steps TEXT[] NOT NULL,
  tools JSONB, -- [{ name, required, alternative }]

  -- Nutrition (calculated or manual)
  nutrition JSONB, -- { calories, protein, carbs, fat, fiber, sugar }

  -- Categorization
  category VARCHAR(50), -- dessert, bread, breakfast, etc.
  tags TEXT[], -- vegan, gluten-free, chocolate, etc.
  cuisine VARCHAR(50), -- whimsical, french, italian, etc.
  season VARCHAR(20), -- spring, summer, fall, winter, all

  -- SEO & Search
  search_vector tsvector, -- Full-text search

  -- Stats (denormalized for performance)
  view_count INT DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  review_count INT DEFAULT 0,
  save_count INT DEFAULT 0,

  -- Publishing
  author_id UUID REFERENCES users(id),
  published_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_recipes_slug ON recipes(slug);
CREATE INDEX idx_recipes_category ON recipes(category);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_search ON recipes USING GIN(search_vector);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX idx_recipes_published ON recipes(published_at DESC NULLS LAST);
```

#### Ratings & Reviews
```sql
-- Recipe ratings
CREATE TABLE recipe_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(recipe_id, user_id) -- One rating per user per recipe
);

CREATE INDEX idx_ratings_recipe ON recipe_ratings(recipe_id);
CREATE INDEX idx_ratings_user ON recipe_ratings(user_id);

-- Recipe reviews
CREATE TABLE recipe_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT NOT NULL,
  images TEXT[], -- User photos

  -- Review metadata
  made_modifications BOOLEAN DEFAULT FALSE,
  would_make_again BOOLEAN,

  -- Moderation
  is_approved BOOLEAN DEFAULT FALSE,
  moderated_by UUID REFERENCES users(id),
  moderated_at TIMESTAMP,

  -- Engagement
  helpful_count INT DEFAULT 0,
  not_helpful_count INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_recipe ON recipe_reviews(recipe_id);
CREATE INDEX idx_reviews_user ON recipe_reviews(user_id);
CREATE INDEX idx_reviews_approved ON recipe_reviews(is_approved, created_at DESC);

-- Review helpfulness votes
CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES recipe_reviews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);
```

#### Comments
```sql
-- Recipe comments (threaded)
CREATE TABLE recipe_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES recipe_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,

  -- Moderation
  is_approved BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE,

  -- Engagement
  like_count INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_recipe ON recipe_comments(recipe_id, created_at DESC);
CREATE INDEX idx_comments_user ON recipe_comments(user_id);
CREATE INDEX idx_comments_parent ON recipe_comments(parent_id);

-- Comment likes
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES recipe_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);
```

#### User Collections
```sql
-- User recipe collections (recipe box)
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_collections_user ON collections(user_id);

-- Saved recipes in collections
CREATE TABLE collection_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  notes TEXT, -- Personal notes
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(collection_id, recipe_id)
);

CREATE INDEX idx_collection_recipes_collection ON collection_recipes(collection_id);
```

#### Search & Analytics
```sql
-- Search queries (for analytics)
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query TEXT NOT NULL,
  filters JSONB,
  result_count INT,
  clicked_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_search_queries_created ON search_queries(created_at DESC);

-- Recipe views (for trending)
CREATE TABLE recipe_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  referrer TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recipe_views_recipe ON recipe_views(recipe_id, created_at DESC);
```

### Materialized Views (Performance)

```sql
-- Trending recipes (refreshed hourly)
CREATE MATERIALIZED VIEW trending_recipes AS
SELECT
  r.id,
  r.slug,
  r.title,
  r.image_url,
  r.rating_avg,
  COUNT(rv.id) as views_7d,
  COUNT(rr.id) as reviews_7d
FROM recipes r
LEFT JOIN recipe_views rv ON rv.recipe_id = r.id
  AND rv.created_at > NOW() - INTERVAL '7 days'
LEFT JOIN recipe_reviews rr ON rr.recipe_id = r.id
  AND rr.created_at > NOW() - INTERVAL '7 days'
GROUP BY r.id
ORDER BY views_7d DESC, reviews_7d DESC
LIMIT 20;

CREATE UNIQUE INDEX idx_trending_recipes_id ON trending_recipes(id);

-- User activity summary
CREATE MATERIALIZED VIEW user_activity AS
SELECT
  u.id,
  u.username,
  COUNT(DISTINCT rr.id) as review_count,
  COUNT(DISTINCT rc.id) as comment_count,
  COUNT(DISTINCT cr.id) as saved_count
FROM users u
LEFT JOIN recipe_reviews rr ON rr.user_id = u.id
LEFT JOIN recipe_comments rc ON rc.user_id = u.id
LEFT JOIN collection_recipes cr ON cr.collection_id IN (
    SELECT id FROM collections WHERE user_id = u.id
  )
GROUP BY u.id;

CREATE UNIQUE INDEX idx_user_activity_id ON user_activity(id);
```

---

## API Specification

### Authentication Endpoints

```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  display_name?: string;
}

interface RegisterResponse {
  user: {
    id: string;
    email: string;
    username: string;
    display_name: string;
  };
  access_token: string; // JWT, 15min expiry
  // refresh_token set as httpOnly cookie
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  access_token: string;
}

// POST /api/auth/logout
// Clears httpOnly refresh token

// POST /api/auth/refresh
// Returns new access token using refresh token cookie

// GET /api/auth/me
// Returns current user (requires auth)
```

### Recipe Endpoints

```typescript
// GET /api/recipes
interface RecipesQueryParams {
  page?: number; // Default: 1
  limit?: number; // Default: 20, Max: 100
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[]; // Multiple tags
  season?: string;
  search?: string; // Full-text search
  sort?: 'latest' | 'popular' | 'rating' | 'trending';
  min_rating?: number; // Filter by rating (1-5)
}

interface RecipesResponse {
  recipes: Recipe[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// GET /api/recipes/:slug
interface RecipeResponse {
  recipe: Recipe & {
    rating_avg: number;
    rating_count: number;
    review_count: number;
    user_rating?: number; // If authenticated
    user_saved?: boolean; // If authenticated
  };
}

// POST /api/recipes (admin/premium only)
interface CreateRecipeRequest {
  title: string;
  description: string;
  story?: string[];
  ingredients: Ingredient[];
  steps: string[];
  // ... other fields
}
```

### Ratings & Reviews Endpoints

```typescript
// POST /api/recipes/:slug/ratings
interface RateRecipeRequest {
  rating: number; // 1-5
}

// GET /api/recipes/:slug/reviews
interface ReviewsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'helpful' | 'recent' | 'rating_high' | 'rating_low';
  rating?: number; // Filter by specific rating
}

interface ReviewsResponse {
  reviews: Review[];
  stats: {
    total: number;
    average: number;
    breakdown: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  pagination: Pagination;
}

// POST /api/recipes/:slug/reviews
interface CreateReviewRequest {
  rating: number;
  title?: string;
  content: string;
  images?: string[]; // Image URLs
  made_modifications?: boolean;
  would_make_again?: boolean;
}

// POST /api/reviews/:id/vote
interface VoteReviewRequest {
  is_helpful: boolean;
}
```

### Search Endpoint

```typescript
// GET /api/search
interface SearchQueryParams {
  q: string; // Search query
  category?: string;
  difficulty?: string;
  tags?: string[];
  min_rating?: number;
  page?: number;
  limit?: number;
}

interface SearchResponse {
  results: Recipe[];
  suggestions: string[]; // Search suggestions
  filters: {
    categories: Array<{ name: string; count: number }>;
    tags: Array<{ name: string; count: number }>;
    difficulty: Array<{ level: string; count: number }>;
  };
  pagination: Pagination;
}

// GET /api/search/autocomplete
interface AutocompleteParams {
  q: string;
  limit?: number;
}

interface AutocompleteResponse {
  recipes: Array<{ slug: string; title: string }>;
  ingredients: string[];
  tags: string[];
}
```

### User Endpoints

```typescript
// GET /api/users/:username
interface UserProfileResponse {
  user: {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    bio: string;
    created_at: string;
  };
  stats: {
    review_count: number;
    comment_count: number;
    collections_count: number;
  };
  public_collections?: Collection[];
}

// GET /api/users/me/collections
interface CollectionsResponse {
  collections: Collection[];
}

// POST /api/users/me/collections
interface CreateCollectionRequest {
  name: string;
  description?: string;
  is_public?: boolean;
}

// POST /api/collections/:id/recipes
interface AddRecipeToCollectionRequest {
  recipe_id: string;
  notes?: string;
}
```

### Admin/Moderation Endpoints

```typescript
// GET /api/admin/reviews/pending
// Returns reviews awaiting approval

// POST /api/admin/reviews/:id/approve
// Approves a review

// POST /api/admin/reviews/:id/reject
interface RejectReviewRequest {
  reason: string;
}

// GET /api/admin/comments/flagged
// Returns flagged comments

// POST /api/admin/users/:id/ban
interface BanUserRequest {
  reason: string;
  duration?: number; // Days, or permanent if omitted
}
```

---

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── AuthProvider.jsx
│   │
│   ├── recipes/
│   │   ├── RecipeCard.jsx
│   │   ├── RecipeGrid.jsx
│   │   ├── RecipeFilters.jsx
│   │   ├── RecipeSearch.jsx
│   │   └── RecipeTemplate.jsx (existing, enhanced)
│   │
│   ├── ratings/
│   │   ├── StarRating.jsx
│   │   ├── RatingBreakdown.jsx
│   │   ├── RatingStats.jsx
│   │   └── RateRecipeButton.jsx
│   │
│   ├── reviews/
│   │   ├── ReviewCard.jsx
│   │   ├── ReviewList.jsx
│   │   ├── ReviewForm.jsx
│   │   ├── ReviewFilters.jsx
│   │   └── ReviewVoteButtons.jsx
│   │
│   ├── comments/
│   │   ├── CommentThread.jsx
│   │   ├── CommentForm.jsx
│   │   ├── CommentCard.jsx
│   │   └── CommentActions.jsx
│   │
│   ├── user/
│   │   ├── UserProfile.jsx
│   │   ├── UserAvatar.jsx
│   │   ├── UserStats.jsx
│   │   └── EditProfileForm.jsx
│   │
│   ├── collections/
│   │   ├── CollectionGrid.jsx
│   │   ├── CollectionCard.jsx
│   │   ├── SaveToCollectionButton.jsx
│   │   └── CreateCollectionModal.jsx
│   │
│   └── common/
│       ├── SearchBar.jsx
│       ├── Pagination.jsx
│       ├── FilterChips.jsx
│       ├── LoadingSpinner.jsx
│       └── ErrorBoundary.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useRecipes.js
│   ├── useReviews.js
│   ├── useRatings.js
│   ├── useComments.js
│   ├── useCollections.js
│   ├── useSearch.js
│   └── useInfiniteScroll.js
│
├── services/
│   ├── api.js (axios instance)
│   ├── auth.service.js
│   ├── recipe.service.js
│   ├── review.service.js
│   └── user.service.js
│
├── context/
│   ├── AuthContext.jsx
│   ├── ThemeContext.jsx
│   └── NotificationContext.jsx
│
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── storage.js (localStorage wrapper)
│
└── pages/
    ├── LoginPage.jsx
    ├── RegisterPage.jsx
    ├── RecipeIndexPage.jsx (enhanced)
    ├── RecipePage.jsx (enhanced)
    ├── SearchResultsPage.jsx
    ├── UserProfilePage.jsx
    └── CollectionsPage.jsx
```

### Custom Hooks

```javascript
// useAuth.js
export function useAuth() {
  const context = useContext(AuthContext);
  return {
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    logout: context.logout,
    register: context.register
  };
}

// useRecipes.js (React Query)
export function useRecipes(params = {}) {
  return useQuery({
    queryKey: ['recipes', params],
    queryFn: () => recipeService.getRecipes(params),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

// useRatings.js
export function useRateRecipe(slug) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rating) => ratingService.rateRecipe(slug, rating),
    onSuccess: () => {
      queryClient.invalidateQueries(['recipe', slug]);
      queryClient.invalidateQueries(['recipes']);
    }
  });
}

// useInfiniteScroll.js
export function useInfiniteRecipes(params = {}) {
  return useInfiniteQuery({
    queryKey: ['recipes', 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      recipeService.getRecipes({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.total_pages
        ? lastPage.pagination.page + 1
        : undefined
  });
}
```

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)

#### Week 1: Setup & Infrastructure
- [x] Set up GitHub repository
- [ ] Initialize backend (Express + TypeScript)
- [ ] Configure PostgreSQL database
- [ ] Set up Prisma ORM
- [ ] Create database schema
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure environments (dev, staging, prod)

**Deliverables:**
- Working local development environment
- Database with seed data
- Basic Express server running
- CI/CD pipeline passing

#### Week 2: Authentication Backend
- [ ] Implement user registration endpoint
- [ ] Implement login endpoint
- [ ] JWT token generation/validation
- [ ] Refresh token mechanism
- [ ] Password hashing (bcrypt)
- [ ] Email verification (optional for MVP)

**Tests:**
- [ ] 20+ auth tests (registration, login, token refresh)
- [ ] Security tests (SQL injection, XSS)
- [ ] Rate limiting tests

#### Week 3: Authentication Frontend
- [ ] Create AuthContext provider
- [ ] Build LoginForm component
- [ ] Build RegisterForm component
- [ ] Implement protected routes
- [ ] Add logout functionality
- [ ] Token refresh interceptor

**Tests:**
- [ ] 15+ component tests
- [ ] Integration tests (login → protected page)

**Phase 1 Checkpoint:**
- ✅ Users can register and login
- ✅ Protected routes work
- ✅ 80%+ test coverage
- ✅ Deployed to staging

---

### Phase 2: User Engagement (Weeks 4-6)

#### Week 4: Ratings System
- [ ] Create ratings database tables
- [ ] Build rating backend API
- [ ] Create StarRating component
- [ ] Add RatingStats component
- [ ] Implement optimistic updates
- [ ] Add rating aggregation (triggers)

**Tests:**
- [ ] 15+ backend tests (CRUD, aggregation)
- [ ] 10+ frontend tests (rating interactions)

#### Week 5: Reviews System
- [ ] Create reviews database tables
- [ ] Build reviews backend API
- [ ] Create ReviewForm component
- [ ] Build ReviewList component
- [ ] Add review filtering/sorting
- [ ] Implement review moderation

**Tests:**
- [ ] 20+ backend tests
- [ ] 15+ frontend tests
- [ ] E2E test (submit review → see in list)

#### Week 6: User Profiles
- [ ] Create user profile pages
- [ ] Build EditProfileForm
- [ ] Add avatar upload (Cloudinary)
- [ ] Create user stats dashboard
- [ ] Implement user activity feed

**Tests:**
- [ ] 10+ backend tests
- [ ] 12+ frontend tests

**Phase 2 Checkpoint:**
- ✅ Users can rate recipes
- ✅ Users can write reviews
- ✅ User profiles display activity
- ✅ 80%+ test coverage
- ✅ Deployed to staging

---

### Phase 3: Content Discovery (Weeks 7-9)

#### Week 7: Search Backend
- [ ] Implement PostgreSQL full-text search
- [ ] Create search API endpoint
- [ ] Add autocomplete endpoint
- [ ] Build search analytics
- [ ] Create search indexes

**Tests:**
- [ ] 15+ search tests (relevance, filters)
- [ ] Performance tests (search speed)

#### Week 8: Search Frontend
- [ ] Create SearchBar component
- [ ] Build SearchResultsPage
- [ ] Add autocomplete dropdown
- [ ] Implement search filters
- [ ] Add search history (localStorage)

**Tests:**
- [ ] 12+ component tests
- [ ] E2E test (search → click result)

#### Week 9: Nutrition & Filtering
- [ ] Add nutrition calculation API
- [ ] Create nutrition display component
- [ ] Build advanced filters UI
- [ ] Add dietary restriction badges
- [ ] Implement filter persistence

**Tests:**
- [ ] 10+ nutrition tests
- [ ] 8+ filter tests

**Phase 3 Checkpoint:**
- ✅ Search works with filters
- ✅ Autocomplete responsive
- ✅ Nutrition info displayed
- ✅ 80%+ test coverage
- ✅ Deployed to staging

---

### Phase 4: Social Features (Weeks 10-11)

#### Week 10: Comments System
- [ ] Create comments database (threaded)
- [ ] Build comments backend API
- [ ] Create CommentThread component
- [ ] Add comment moderation
- [ ] Implement comment likes

**Tests:**
- [ ] 15+ backend tests (threading, moderation)
- [ ] 12+ frontend tests

#### Week 11: Collections & Saves
- [ ] Create collections database
- [ ] Build collections API
- [ ] Create CollectionGrid component
- [ ] Add SaveToCollectionButton
- [ ] Implement collection sharing

**Tests:**
- [ ] 12+ backend tests
- [ ] 10+ frontend tests

**Phase 4 Checkpoint:**
- ✅ Comments system working
- ✅ Users can save recipes to collections
- ✅ 80%+ test coverage
- ✅ Deployed to staging

---

### Phase 5: Monetization & Launch (Weeks 12-16)

#### Week 12-13: Monetization Setup
- [ ] Integrate Stripe for subscriptions
- [ ] Create premium tier features
- [ ] Add display ad placements (Mediavine setup)
- [ ] Implement affiliate links system
- [ ] Build admin dashboard

**Tests:**
- [ ] 10+ payment tests (Stripe test mode)
- [ ] Premium access tests

#### Week 14: Performance & SEO
- [ ] Optimize images (CDN, lazy loading)
- [ ] Implement service workers (PWA)
- [ ] Add meta tags for all pages
- [ ] Create XML sitemap
- [ ] Optimize Core Web Vitals

**Tests:**
- [ ] Lighthouse score >90
- [ ] Load time <3s

#### Week 15: Beta Testing
- [ ] Deploy to production (10% rollout)
- [ ] Monitor error rates (Sentry)
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Performance tuning

#### Week 16: Full Launch
- [ ] 50% rollout
- [ ] Marketing campaign
- [ ] 100% rollout
- [ ] Post-launch monitoring

**Phase 5 Checkpoint:**
- ✅ All features deployed
- ✅ No critical bugs
- ✅ Performance targets met
- ✅ Revenue streams active

---

## Testing Strategy

### Test Coverage Goals

| Layer | Tool | Target Coverage | Test Count |
|-------|------|----------------|-----------|
| Backend API | Jest + Supertest | 80%+ | 200+ tests |
| Frontend Components | Vitest + RTL | 80%+ | 150+ tests |
| E2E User Flows | Playwright | Critical paths | 50+ tests |
| **TOTAL** | | **80%+** | **400+ tests** |

### TDD Workflow (Red-Green-Refactor)

```bash
# 1. RED: Write failing test
npm run test:watch

# 2. GREEN: Implement minimum code to pass
# 3. REFACTOR: Clean up code
# 4. VERIFY: Run full test suite
npm run test:coverage
```

### Example Test Cases

#### Backend: Recipe Rating Test
```javascript
// tests/api/ratings.test.js
describe('POST /api/recipes/:slug/ratings', () => {
  it('should create a new rating for authenticated user', async () => {
    const token = await getAuthToken();
    const response = await request(app)
      .post('/api/recipes/chocolate-chip-cookies/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 });

    expect(response.status).toBe(201);
    expect(response.body.rating).toBe(5);
  });

  it('should prevent duplicate ratings from same user', async () => {
    const token = await getAuthToken();
    // First rating
    await request(app)
      .post('/api/recipes/chocolate-chip-cookies/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 5 });

    // Duplicate rating
    const response = await request(app)
      .post('/api/recipes/chocolate-chip-cookies/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({ rating: 4 });

    expect(response.status).toBe(409); // Conflict
  });

  it('should update recipe average rating', async () => {
    // ... test rating aggregation
  });
});
```

#### Frontend: Star Rating Component Test
```javascript
// tests/components/StarRating.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '@/components/ratings/StarRating';

describe('StarRating', () => {
  it('should render 5 stars', () => {
    render(<StarRating value={0} onChange={vi.fn()} />);
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
  });

  it('should highlight stars on hover', () => {
    render(<StarRating value={0} onChange={vi.fn()} />);
    const thirdStar = screen.getAllByRole('button')[2];

    fireEvent.mouseEnter(thirdStar);

    expect(thirdStar).toHaveClass('star-filled');
  });

  it('should call onChange with correct rating', () => {
    const onChange = vi.fn();
    render(<StarRating value={0} onChange={onChange} />);
    const fourthStar = screen.getAllByRole('button')[3];

    fireEvent.click(fourthStar);

    expect(onChange).toHaveBeenCalledWith(4);
  });
});
```

#### E2E: Submit Review Flow
```javascript
// tests/e2e/review-submission.spec.js
import { test, expect } from '@playwright/test';

test('user can submit a recipe review', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to recipe
  await page.goto('/recipes/chocolate-chip-cookies');

  // Click "Write a Review"
  await page.click('text=Write a Review');

  // Fill review form
  await page.click('[aria-label="5 stars"]');
  await page.fill('[name="title"]', 'Amazing cookies!');
  await page.fill('[name="content"]', 'These were the best cookies I ever made.');
  await page.check('[name="would_make_again"]');

  // Submit
  await page.click('button[type="submit"]');

  // Verify success
  await expect(page.locator('text=Review submitted')).toBeVisible();
  await expect(page.locator('text=Amazing cookies!')).toBeVisible();
});
```

### Test Data Management

```javascript
// tests/factories/user.factory.js
export const createTestUser = async (overrides = {}) => {
  return {
    email: overrides.email || 'test@example.com',
    username: overrides.username || 'testuser',
    password: overrides.password || 'Password123!',
    display_name: overrides.display_name || 'Test User'
  };
};

// tests/factories/recipe.factory.js
export const createTestRecipe = async (overrides = {}) => {
  return {
    slug: overrides.slug || 'test-recipe',
    title: overrides.title || 'Test Recipe',
    ingredients: overrides.ingredients || [
      { amount: '2', unit: 'cups', name: 'flour' }
    ],
    steps: overrides.steps || ['Mix ingredients', 'Bake'],
    // ... more fields
  };
};
```

---

## Deployment Plan

### Infrastructure Setup

#### DigitalOcean App Platform (Backend)
```yaml
# app.yaml
name: sunday-brunch-api
region: nyc
services:
  - name: api
    github:
      repo: your-org/sunday-brunch-backend
      branch: main
      deploy_on_push: true
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    instance_size_slug: basic-xs # $12/month
    envs:
      - key: DATABASE_URL
        scope: RUN_TIME
        type: SECRET
      - key: JWT_SECRET
        scope: RUN_TIME
        type: SECRET
      - key: NODE_ENV
        value: production

databases:
  - name: sunday-brunch-db
    engine: PG
    version: "15"
    size: db-s-1vcpu-1gb # $15/month
```

#### Vercel (Frontend)
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@api-url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ]
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run lint
      - run: npm run type-check

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run build

  e2e-tests:
    needs: [test-backend, test-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npx playwright install
      - run: npm run test:e2e

  deploy-staging:
    needs: [test-backend, test-frontend, e2e-tests]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: |
          # Deploy backend to DigitalOcean staging
          # Deploy frontend to Vercel staging
```

### Deployment Rollout Strategy

#### Stage 1: Internal Testing (Week 15)
- Deploy to `staging.sundaybrunch.com`
- Team testing (5-10 people)
- Fix critical bugs
- Performance benchmarks

#### Stage 2: Beta Testing (Week 16, Days 1-2)
- Deploy to production
- **10% traffic** (feature flag or A/B test)
- Monitor error rates (Sentry)
- Monitor performance (New Relic)
- Gather user feedback

#### Stage 3: Controlled Rollout (Week 16, Days 3-5)
- Increase to **50% traffic**
- Continue monitoring
- Address feedback
- Performance tuning

#### Stage 4: Full Launch (Week 16, Days 6-7)
- **100% traffic**
- Marketing announcement
- Newsletter blast
- Social media campaign
- Press release

---

## Risk Analysis

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Database performance degrades with scale** | Medium | High | Use materialized views, add Redis caching, optimize queries |
| **API rate limiting issues** | Low | Medium | Implement per-user rate limits, add Cloudflare |
| **Auth vulnerabilities (XSS, CSRF)** | Medium | Critical | httpOnly cookies, CSP headers, security audits |
| **Image upload abuse** | High | Medium | File size limits, virus scanning, Cloudflare R2 |
| **Spam reviews/comments** | High | Medium | Moderation queue, CAPTCHA, rate limiting |
| **Search performance issues** | Medium | Medium | PostgreSQL → Elasticsearch migration path |
| **Third-party API failures (Stripe)** | Low | High | Graceful degradation, retry logic, monitoring |

### Business Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **Low user adoption** | Medium | High | Beta testing, user interviews, marketing plan |
| **Revenue below projections** | Medium | Medium | Multiple revenue streams, cost optimization |
| **Content moderation overhead** | High | Medium | Community moderators, automated flagging |
| **Competitor launches similar features** | Medium | Low | Focus on unique brand (Shelties), quality content |
| **Infrastructure costs exceed budget** | Low | Medium | Monitor usage, optimize resources, serverless options |

### Security Risks

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| **SQL injection attacks** | Low | Critical | Parameterized queries (Prisma ORM), input validation |
| **Account takeover (weak passwords)** | Medium | High | Password strength requirements, 2FA (future) |
| **DDoS attacks** | Low | High | Cloudflare protection, rate limiting |
| **Data breach (user data leak)** | Low | Critical | Encryption at rest, HTTPS, regular audits |
| **Payment fraud** | Low | High | Stripe fraud detection, monitoring |

---

## Success Metrics

### Phase 1 (Weeks 1-3): Foundation
- ✅ 100% test coverage on auth
- ✅ <500ms API response time
- ✅ Zero critical security vulnerabilities
- ✅ CI/CD pipeline: <5min build time

### Phase 2 (Weeks 4-6): User Engagement
- ✅ 100+ beta users registered
- ✅ 50+ recipes rated
- ✅ 20+ reviews submitted
- ✅ <2s page load time

### Phase 3 (Weeks 7-9): Content Discovery
- ✅ Search response time <200ms
- ✅ 90% search relevance (user feedback)
- ✅ 50+ searches per day

### Phase 4 (Weeks 10-11): Social Features
- ✅ 100+ comments posted
- ✅ 50+ collections created
- ✅ 20% of users save at least 1 recipe

### Phase 5 (Weeks 12-16): Monetization & Launch
- ✅ 1,000+ registered users (first month)
- ✅ 100+ premium subscribers ($499/month revenue)
- ✅ 500+ recipes rated
- ✅ 100+ reviews
- ✅ $500/month ad revenue (Mediavine pending)
- ✅ Lighthouse score >90
- ✅ Zero critical bugs in production

### 6-Month Goals (Post-Launch)
- 🎯 10,000+ registered users
- 🎯 500+ premium subscribers ($2,500/month)
- 🎯 5,000+ recipe reviews
- 🎯 1,000+ rated recipes
- 🎯 $8,500/month total revenue
  - Premium: $2,500
  - Ads: $3,000
  - Affiliate: $2,000
  - Courses: $1,000

---

## Open Questions

### Product Questions
1. **Premium Tier Features** - What content/features justify $4.99/month?
   - [ ] Option A: Ad-free experience + exclusive recipes
   - [ ] Option B: Meal planning tools + shopping lists
   - [ ] Option C: Video tutorials + live Q&A sessions
   - [ ] **Recommendation:** All of the above, tiered pricing

2. **User-Submitted Recipes** - How to maintain quality?
   - [ ] Option A: Full editorial review (slow, high quality)
   - [ ] Option B: Community voting (fast, variable quality)
   - [ ] Option C: Verified user badge (medium quality)
   - [ ] **Recommendation:** Start with Option A, scale to C

3. **Real-Time Features** - Polling vs WebSockets?
   - [ ] Option A: Polling every 30s (simple, works everywhere)
   - [ ] Option B: WebSockets (complex, real-time)
   - [ ] **Recommendation:** Start with polling, add WebSockets in Phase 6

4. **Mobile App** - React Native or PWA first?
   - [ ] Option A: PWA (works on all platforms, lower cost)
   - [ ] Option B: React Native (better UX, higher cost)
   - [ ] **Recommendation:** Start with PWA, evaluate React Native after 10k users

5. **Moderation Strategy** - Dedicated team or community-driven?
   - [ ] Option A: Hire moderators (costly, professional)
   - [ ] Option B: Community moderators (free, variable quality)
   - [ ] Option C: Automated + human review (best balance)
   - [ ] **Recommendation:** Start with Option C

### Technical Questions
1. **Image Hosting** - Cloudinary vs Cloudflare R2?
   - [ ] Cloudinary: $0-89/month (transformations included)
   - [ ] Cloudflare R2: $0.015/GB (cheaper at scale)
   - [ ] **Recommendation:** Start with Cloudinary, migrate to R2 after 10k images

2. **Email Service** - SendGrid vs AWS SES?
   - [ ] SendGrid: $0-15/month (40k emails)
   - [ ] AWS SES: $0.10/1000 emails (cheaper at scale)
   - [ ] **Recommendation:** Start with SendGrid (better DX)

3. **Analytics** - Google Analytics vs Plausible?
   - [ ] Google Analytics: Free, powerful, privacy concerns
   - [ ] Plausible: $9/month, privacy-focused
   - [ ] **Recommendation:** Use both (GA for detailed, Plausible for simple)

4. **Error Monitoring** - Sentry vs Rollbar?
   - [ ] Sentry: $0-26/month (better free tier)
   - [ ] Rollbar: $0-49/month (better grouping)
   - [ ] **Recommendation:** Sentry (free tier is sufficient)

---

## Next Steps

### Immediate Actions (This Week)
1. **Get User Feedback**
   - [ ] Send survey to newsletter subscribers
   - [ ] Ask: "What features would make you visit daily?"
   - [ ] Validate premium tier pricing

2. **Technical Setup**
   - [ ] Create GitHub repositories (frontend, backend)
   - [ ] Set up project boards (GitHub Projects)
   - [ ] Provision DigitalOcean account
   - [ ] Set up Vercel account

3. **Team Alignment**
   - [ ] Review this roadmap with team
   - [ ] Answer open questions
   - [ ] Assign roles and responsibilities
   - [ ] Set up weekly check-ins

### Week 1 Sprint Planning
1. **Backend Setup** (3 days)
   - Initialize Express + TypeScript project
   - Configure PostgreSQL + Prisma
   - Create user authentication (TDD)
   - Deploy to staging

2. **Frontend Setup** (2 days)
   - Create AuthContext
   - Build LoginForm + RegisterForm
   - Implement protected routes
   - Connect to backend API

3. **CI/CD** (1 day)
   - Set up GitHub Actions
   - Configure test coverage
   - Add deployment workflows

---

## Appendix

### Technology Stack Summary

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Frontend** |
| Framework | React | 18+ | Existing codebase, component ecosystem |
| Build Tool | Vite | 5+ | Fast HMR, modern |
| State (Server) | React Query | 5+ | Caching, optimistic updates |
| State (Client) | Context API | - | Simple, no Redux needed |
| Routing | React Router | 6+ | Standard |
| Styling | CSS Modules | - | Scoped styles, existing pattern |
| **Backend** |
| Runtime | Node.js | 20 LTS | JavaScript ecosystem |
| Framework | Express | 4.18+ | Minimal, flexible |
| Language | TypeScript | 5+ | Type safety |
| ORM | Prisma | 5+ | Type-safe queries, migrations |
| Validation | Zod | 3+ | TypeScript-first validation |
| **Database** |
| Primary | PostgreSQL | 15+ | ACID, full-text search, JSONB |
| Cache | Redis (Upstash) | 7+ | Session storage, rate limiting |
| **Testing** |
| Backend | Jest + Supertest | - | Industry standard |
| Frontend | Vitest + RTL | - | Fast, Vite-compatible |
| E2E | Playwright | - | Modern, reliable |
| **Infrastructure** |
| Frontend Host | Vercel | - | Excellent DX, free tier |
| Backend Host | DigitalOcean | - | Affordable, managed |
| CDN | CloudFlare | - | Free, global |
| Monitoring | Sentry | - | Error tracking |
| Analytics | Google Analytics | - | Free, comprehensive |

### Estimated Costs Breakdown

| Service | Tier | Cost/Month | Justification |
|---------|------|-----------|---------------|
| **Development Phase** |
| DigitalOcean (Dev) | Basic | $12 | App Platform |
| PostgreSQL (Dev) | Small | $15 | Managed DB |
| Redis (Dev) | Free | $0 | Upstash free tier |
| Vercel (Dev) | Free | $0 | Hobby plan |
| **Subtotal** | | **$27** | |
| **Production Phase** |
| DigitalOcean (Prod) | Professional | $24 | 2x instances |
| PostgreSQL (Prod) | Medium | $30 | More storage |
| Redis (Prod) | Standard | $10 | More connections |
| Vercel (Prod) | Pro | $20 | Custom domains |
| Cloudinary | Free → Paid | $0-89 | Image transformations |
| SendGrid | Free → Essentials | $0-15 | Email delivery |
| Sentry | Team | $26 | Error monitoring |
| **Subtotal** | | **$110-214** | |
| **At Scale (10k+ users)** |
| DigitalOcean | Scaling | $50-100 | Auto-scaling |
| PostgreSQL | Large | $60 | High performance |
| Redis | Premium | $30 | High throughput |
| CDN | Pro | $20 | Cloudflare upgrade |
| **Subtotal** | | **$160-210** | + $50-100 variable |

### Resource Estimates

| Phase | Solo Dev (Hours) | Team (5-6 people, Hours) |
|-------|------------------|--------------------------|
| Phase 1: Foundation | 120 | 24 (1 week) |
| Phase 2: User Engagement | 150 | 30 (1.5 weeks) |
| Phase 3: Content Discovery | 180 | 36 (1.8 weeks) |
| Phase 4: Social Features | 120 | 24 (1.2 weeks) |
| Phase 5: Monetization | 200 | 40 (2 weeks) |
| Testing & Polish | 230 | 46 (2.3 weeks) |
| **TOTAL** | **1000 hours** | **200 hours** (10 weeks) |

**Conversion to Timeline:**
- Solo dev (40h/week): **25 weeks** (6 months)
- Team of 5-6 (40h/week each): **5-6 weeks** per person = **10 weeks total**

---

## Approval Checklist

Before proceeding with implementation, ensure the following are approved:

### Technical Decisions
- [ ] Database: PostgreSQL with Prisma ORM
- [ ] Authentication: JWT + httpOnly cookies
- [ ] Backend: Node.js + Express + TypeScript
- [ ] Frontend: React + Vite + React Query
- [ ] Hosting: Vercel (frontend) + DigitalOcean (backend)
- [ ] Search: PostgreSQL FTS (Phase 1)

### Product Decisions
- [ ] Premium tier pricing: $4.99/month
- [ ] Premium features defined
- [ ] User-submitted recipe approval workflow
- [ ] Moderation strategy (automated + human)
- [ ] Mobile strategy (PWA first)

### Timeline & Resources
- [ ] 12-16 week timeline approved
- [ ] Budget: $110-214/month infrastructure approved
- [ ] Team size and availability confirmed
- [ ] Weekly check-in schedule set

### Success Metrics
- [ ] 10,000 users in 6 months (agreed)
- [ ] $8,500/month revenue target (agreed)
- [ ] 80%+ test coverage (agreed)

---

**Document Status:** Draft v1.0
**Next Review:** After approval questions answered
**Owner:** Development Team
**Last Updated:** 2026-01-06
