# Sprint 3: FAQ & Common Issues

**For full details, see:** [sprint3-implementation-plan.md](./sprint3-implementation-plan.md)

---

## Table of Contents

1. [General Questions](#general-questions)
2. [Supabase Questions](#supabase-questions)
3. [Authentication Questions](#authentication-questions)
4. [Database & RLS Questions](#database--rls-questions)
5. [Testing Questions](#testing-questions)
6. [Common Errors & Solutions](#common-errors--solutions)
7. [Troubleshooting Guide](#troubleshooting-guide)

---

## General Questions

### Q1: Why Supabase instead of a custom backend?

**Answer:** Supabase saves 80+ hours of development time:

| Task | Custom Backend | Supabase | Time Saved |
|------|---------------|----------|-----------|
| Auth setup | 40 hours | 1 hour | 39 hours |
| Database setup | 8 hours | 2 hours | 6 hours |
| API endpoints | 30 hours | 5 hours | 25 hours |
| Real-time | 12 hours | 1 hour | 11 hours |
| File uploads | 6 hours | 2 hours | 4 hours |
| **TOTAL** | **96 hours** | **11 hours** | **85 hours** |

Plus:
- Free tier ($0/month vs $27+/month)
- Better security (RLS built-in)
- Type-safe SDK
- Managed infrastructure

---

### Q2: Can I use Firebase instead of Supabase?

**Answer:** Technically yes, but NOT recommended:

| Factor | Supabase | Firebase | Winner |
|--------|----------|----------|---------|
| Database | PostgreSQL (SQL) | Firestore (NoSQL) | ✅ Supabase (better for relational data) |
| Cost | Free tier generous | Free tier limited | ✅ Supabase |
| SQL Support | Native | No | ✅ Supabase |
| Learning Curve | Medium | Medium | Tie |
| Vendor Lock-in | Low (open source) | High (Google) | ✅ Supabase |

**Verdict:** Stick with Supabase (better for recipe reviews)

---

### Q3: Will this work with my existing static site?

**Answer:** YES! Supabase integrates seamlessly:

```
Current Site (Static JSON)
         ↓
   [NO CHANGES NEEDED]
         ↓
Enhanced Site (Static + Dynamic)
├── Static: Recipe content (title, ingredients, steps)
└── Dynamic: User data (ratings, reviews, auth)
```

Your existing components work as-is. You just ADD new features.

---

### Q4: How long will Sprint 3 actually take?

**Answer:** 3-4 weeks solo (realistic estimate):

- **Week 1:** Auth (40 hours) - straightforward
- **Week 2:** Ratings (30 hours) - moderate
- **Week 3:** Reviews (50 hours) - complex
- **Week 4:** Polish (20 hours) - testing/bugs

**Total:** 140 hours = 3.5 weeks @ 40h/week

**Buffers:**
- Add 20% for unexpected issues (bugs, learning curve)
- Add 1 week if this is your first Supabase project

**Realistic:** 4-5 weeks for first-time Supabase users

---

### Q5: What if I can't do 40 hours/week?

**Answer:** Adjust timeline proportionally:

| Hours/Week | Duration | Notes |
|-----------|----------|-------|
| 40 hours | 4 weeks | Full-time |
| 20 hours | 8 weeks | Part-time |
| 10 hours | 16 weeks | Hobby pace |

**Tip:** Work in complete "units" (don't split Day 1 across multiple days)

---

## Supabase Questions

### Q6: Do I need to install Supabase locally?

**Answer:** NO (use cloud):

**Cloud Supabase (Recommended):**
- ✅ No local setup needed
- ✅ Free tier available
- ✅ Just sign up at https://supabase.com
- ✅ Get project URL + API keys
- ✅ Start coding immediately

**Local Supabase (Optional):**
- ❌ Requires Docker
- ❌ More complex setup
- ❌ Only needed for offline dev
- ⚠️ NOT recommended for Sprint 3

**Verdict:** Use cloud Supabase (simpler)

---

### Q7: How do I get Supabase credentials?

**Answer:** Follow these steps:

1. Go to https://supabase.com
2. Sign up (free)
3. Create new project (`sunday-brunch-reviews`)
4. Wait 2 minutes for provisioning
5. Go to Settings → API
6. Copy:
   - **Project URL:** `https://xxx.supabase.co`
   - **Anon Key:** `eyJxxx...` (public, safe for frontend)

**Add to `.env`:**
```bash
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

**Security Note:** The "anon key" is PUBLIC. It's safe to expose in frontend code. Row-Level Security (RLS) protects your data.

---

### Q8: What's Row-Level Security (RLS)?

**Answer:** RLS = database-level access control:

**Without RLS:**
```sql
-- User can see ALL reviews
SELECT * FROM recipe_reviews;
```

**With RLS:**
```sql
-- User can only see approved reviews
-- (unless it's their own review)
SELECT * FROM recipe_reviews
WHERE is_approved = true
   OR user_id = current_user_id;
```

**Benefits:**
- ✅ No backend code needed for auth checks
- ✅ Database enforces security (can't bypass)
- ✅ Impossible to see other users' data
- ✅ Automatic protection

**Example:**
```sql
CREATE POLICY "Users can view approved reviews"
  ON public.recipe_reviews FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id);
```

This policy means:
- Anyone can see approved reviews
- Users can always see their own reviews (even if not approved yet)

---

### Q9: How much will Supabase cost?

**Answer:** Likely $0/month for Sprint 3:

**Free Tier Limits:**
- 500MB database storage
- 1GB file storage
- 2GB bandwidth/month
- 50,000 monthly active users
- Unlimited API requests

**Sprint 3 Usage (estimated):**
- Database: ~10MB (100 users, 200 reviews)
- Storage: ~50MB (100 review images @ 500KB each)
- Bandwidth: ~200MB/month
- Users: <100

**Verdict:** Free tier is MORE than enough

**When you'd upgrade to Pro ($25/month):**
- 500+ monthly active users
- 5000+ reviews
- 1000+ review images

---

### Q10: Can I migrate away from Supabase later?

**Answer:** YES (low vendor lock-in):

Supabase uses **standard PostgreSQL**, so you can:
1. Export database (SQL dump)
2. Import to any PostgreSQL host (AWS RDS, DigitalOcean, etc.)
3. Replace Supabase client with standard PostgreSQL client

**What you'd lose:**
- Row-Level Security (manual implementation needed)
- Real-time subscriptions (use WebSockets instead)
- Auth helpers (use Passport.js or similar)
- Storage (use S3 or Cloudinary)

**Effort:** ~40 hours to migrate fully

**Verdict:** Supabase is NOT a vendor lock-in trap (it's just PostgreSQL)

---

## Authentication Questions

### Q11: Do I need to implement OAuth (Google/Facebook login)?

**Answer:** NO (not for MVP):

**Sprint 3 Scope:**
- ✅ Email/password only
- ❌ OAuth (Google, Facebook) - OPTIONAL for Sprint 4+

**Why skip OAuth for now:**
1. Email/password is 80% simpler
2. Supabase OAuth setup is easy (but requires Google/Facebook app registration)
3. Most users are fine with email/password for recipe site

**When to add OAuth:**
- Sprint 4+ (after core features work)
- If users request it
- If you want social login for better conversion

**Effort:** +4 hours per provider (Google = 2h setup + 2h testing)

---

### Q12: How do I handle "forgot password"?

**Answer:** Supabase has built-in reset:

```typescript
// Forgot password (sends email)
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: 'https://yoursite.com/reset-password'
});

// User clicks link in email → redirected to /reset-password
// Then:
const { error } = await supabase.auth.updateUser({
  password: newPassword
});
```

**Sprint 3 Scope:**
- ⚠️ Skip forgot password for MVP (focus on core features)
- Add in Sprint 4 if time allows

**Effort:** +3 hours (form + email template + testing)

---

### Q13: How do I handle email verification?

**Answer:** Supabase sends verification email automatically:

**Default Behavior:**
- User signs up
- Supabase sends verification email
- User clicks link
- Email verified (stored in `auth.users.email_confirmed_at`)

**To enforce verification:**
```typescript
// Check if email is verified
const { data: { user } } = await supabase.auth.getUser();
if (!user.email_confirmed_at) {
  // Show "Please verify your email" message
}
```

**Sprint 3 Scope:**
- ⚠️ Allow unverified users for MVP
- Add enforcement in Sprint 4 if needed

**Why skip for now:** Reduces friction (users can start rating immediately)

---

## Database & RLS Questions

### Q14: What if I mess up the database schema?

**Answer:** Easy to fix with migrations:

**Option 1: Supabase Dashboard (Recommended for Sprint 3)**
1. Go to SQL Editor
2. Write ALTER TABLE statement
3. Run migration
4. Test changes

**Option 2: Supabase CLI (Advanced)**
```bash
supabase migration new add_column
# Edit generated SQL file
supabase db push
```

**Example: Add column**
```sql
ALTER TABLE recipe_reviews
ADD COLUMN featured BOOLEAN DEFAULT FALSE;
```

**Rollback:** Just run reverse SQL
```sql
ALTER TABLE recipe_reviews DROP COLUMN featured;
```

**Tip:** Test schema changes locally first (use a test project)

---

### Q15: How do I test RLS policies?

**Answer:** Use Supabase SQL Editor:

**Method 1: Test in SQL Editor**
```sql
-- Test as anonymous user
SELECT * FROM recipe_reviews;
-- Should only see approved reviews

-- Test as specific user
SELECT auth.uid(); -- Returns user ID
SELECT * FROM recipe_reviews WHERE user_id = auth.uid();
-- Should see own reviews (approved or not)
```

**Method 2: Test in app**
1. Create 2 test accounts (user1, user2)
2. User1 creates review
3. Check: User2 can't see it (not approved)
4. Admin approves review
5. Check: User2 can now see it

**Method 3: Unit tests**
```javascript
// tests/services/review.service.test.ts
it('should not show unapproved reviews to other users', async () => {
  // Create review as user1 (not approved)
  // Try to fetch as user2
  // Expect: review not in results
});
```

---

### Q16: What if two users rate the same recipe at the same time?

**Answer:** Database handles it (UNIQUE constraint):

**Database Schema:**
```sql
CREATE TABLE recipe_ratings (
  recipe_slug VARCHAR(255),
  user_id UUID,
  rating INT,
  UNIQUE(recipe_slug, user_id) -- Prevents duplicates
);
```

**What happens:**
1. User A and User B both click "5 stars" simultaneously
2. Database processes in order:
   - User A: INSERT succeeds
   - User B: INSERT succeeds (different user_id)
3. Both ratings saved ✅

**Edge case (same user, double-click):**
1. User A clicks "5 stars" twice (quickly)
2. Database processes:
   - First click: INSERT succeeds
   - Second click: UPSERT (updates existing rating)
3. Result: Only one rating (latest value) ✅

**Verdict:** Database handles concurrency automatically (no special code needed)

---

## Testing Questions

### Q17: How do I test components that use Supabase?

**Answer:** Mock the Supabase client:

```javascript
// tests/components/ReviewForm.test.jsx
import { vi } from 'vitest';

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: mockReview, error: null }))
        }))
      }))
    }))
  }
}));

// Now test component
it('should submit review', async () => {
  render(<ReviewForm recipeSlug="test" onSubmit={vi.fn()} />);
  // ... fill form, click submit
  // Verify mock was called
});
```

**Alternative: Use Supabase test instance**
```javascript
// Setup test database (one-time)
const testSupabase = createClient(TEST_URL, TEST_KEY);

// In tests
it('should create review in database', async () => {
  const review = await reviewService.createReview({ ... });
  // Verify in real database (test project)
});
```

**Recommendation:** Use mocks for unit tests, real database for integration tests

---

### Q18: How do I test RLS policies?

**Answer:** Create test users with different permissions:

```javascript
// tests/integration/rls.test.ts
describe('Recipe Reviews RLS', () => {
  let user1, user2, admin;

  beforeAll(async () => {
    // Create test users
    user1 = await createTestUser('user1@test.com');
    user2 = await createTestUser('user2@test.com');
    admin = await createTestUser('admin@test.com', { role: 'admin' });
  });

  it('should prevent user2 from seeing user1 unapproved review', async () => {
    // User1 creates review
    const supabaseUser1 = createAuthenticatedClient(user1.token);
    await supabaseUser1.from('recipe_reviews').insert({ ... });

    // User2 tries to see it
    const supabaseUser2 = createAuthenticatedClient(user2.token);
    const { data } = await supabaseUser2
      .from('recipe_reviews')
      .select('*')
      .eq('recipe_slug', 'test-recipe');

    expect(data).toHaveLength(0); // Should not see unapproved review
  });

  it('should allow admin to approve review', async () => {
    const supabaseAdmin = createAuthenticatedClient(admin.token);
    const { error } = await supabaseAdmin
      .from('recipe_reviews')
      .update({ is_approved: true })
      .eq('id', reviewId);

    expect(error).toBeNull();
  });
});
```

---

### Q19: What test coverage should I aim for?

**Answer:** 85%+ overall (varies by layer):

| Layer | Target Coverage | Priority |
|-------|----------------|----------|
| Services | 90%+ | High (critical business logic) |
| Components | 85%+ | High (user-facing) |
| Hooks | 90%+ | High (shared logic) |
| Utils | 95%+ | Medium (easy to test) |
| Pages | 70%+ | Low (mostly composition) |

**Focus on:**
- ✅ Critical paths (auth, rating, review submission)
- ✅ Error handling (network failures, validation)
- ✅ Edge cases (no data, empty states)
- ✅ Accessibility (keyboard navigation, screen readers)

**Skip:**
- ❌ Trivial code (simple getters)
- ❌ Third-party library internals (trust Supabase)
- ❌ Styling-only components (visual regression instead)

---

## Common Errors & Solutions

### Error 1: "Supabase client is not initialized"

**Symptoms:**
```
TypeError: Cannot read property 'from' of undefined
```

**Cause:** Missing environment variables

**Solution:**
```bash
# .env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
```

**Checklist:**
- [ ] `.env` file exists in project root
- [ ] Variables start with `VITE_` (required for Vite)
- [ ] Restart dev server after adding `.env`
- [ ] Check values are correct (no extra spaces)

---

### Error 2: "Row Level Security policy prevents this operation"

**Symptoms:**
```
PostgresError: new row violates row-level security policy
```

**Cause:** RLS policy is too restrictive

**Solution:**
1. Check user is authenticated:
   ```javascript
   const { data: { user } } = await supabase.auth.getUser();
   console.log('User:', user); // Should not be null
   ```

2. Check RLS policy:
   ```sql
   -- Go to Supabase Dashboard → Authentication → Policies
   -- Verify policy allows INSERT
   CREATE POLICY "Authenticated users can insert ratings"
     ON recipe_ratings FOR INSERT
     WITH CHECK (auth.uid() = user_id);
   ```

3. Test policy:
   ```sql
   -- In SQL Editor
   SELECT auth.uid(); -- Should return user ID
   INSERT INTO recipe_ratings (recipe_slug, user_id, rating)
   VALUES ('test', auth.uid(), 5);
   ```

---

### Error 3: "Invalid JWT token"

**Symptoms:**
```
AuthError: Invalid Refresh Token: Refresh Token Not Found
```

**Cause:** Session expired or cleared

**Solution:**
```typescript
// Add auto-refresh in AuthContext
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed');
      }
      if (event === 'SIGNED_OUT') {
        // Redirect to login
      }
    }
  );

  return () => subscription.unsubscribe();
}, []);
```

---

### Error 4: "Storage upload failed"

**Symptoms:**
```
StorageError: The resource already exists
```

**Cause:** Trying to upload file with same name

**Solution:**
```typescript
// Add unique filename
const fileExt = file.name.split('.').pop();
const fileName = `${userId}/${Date.now()}.${fileExt}`;

const { data, error } = await supabase.storage
  .from('review-images')
  .upload(fileName, file, {
    upsert: false // Fail if exists (instead of overwrite)
  });
```

---

### Error 5: "Real-time subscription not working"

**Symptoms:** Changes in database don't appear in UI

**Cause:** Realtime not enabled for table

**Solution:**
1. Go to Supabase Dashboard → Database → Replication
2. Enable replication for tables:
   - [ ] `recipe_ratings`
   - [ ] `recipe_reviews`
   - [ ] `review_votes`

**Then test:**
```typescript
// Should log changes
const subscription = supabase
  .channel('test')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'recipe_ratings'
  }, (payload) => {
    console.log('Change detected:', payload);
  })
  .subscribe();
```

---

## Troubleshooting Guide

### Issue: Tests failing with "auth is not defined"

**Symptoms:**
```
ReferenceError: auth is not defined
```

**Cause:** RLS policy references `auth.uid()` but tests don't authenticate

**Solution:**
```javascript
// Mock authenticated user in tests
beforeEach(() => {
  vi.mock('@/lib/supabase', () => ({
    supabase: {
      auth: {
        getUser: vi.fn(() => Promise.resolve({
          data: { user: { id: 'test-user-123' } }
        }))
      }
    }
  }));
});
```

---

### Issue: Form submission not working

**Checklist:**
- [ ] User is authenticated (`useAuth()` returns user)
- [ ] Form validation passes (check console for errors)
- [ ] Network request is sent (check Network tab)
- [ ] RLS policy allows INSERT (check Supabase logs)
- [ ] No CORS errors (shouldn't happen with Supabase)

**Debug:**
```typescript
const handleSubmit = async (formData) => {
  console.log('Submitting:', formData);

  try {
    const result = await reviewService.createReview(formData);
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
    // Check error.message for clues
  }
};
```

---

### Issue: Images not displaying

**Checklist:**
- [ ] Storage bucket is public (check Supabase Dashboard)
- [ ] Image URL is correct (should be `https://xxx.supabase.co/storage/v1/object/public/...`)
- [ ] Image uploaded successfully (check Storage tab)
- [ ] No CORS errors (check console)

**Test:**
```typescript
// Upload test image
const testFile = new File(['test'], 'test.png', { type: 'image/png' });
const url = await reviewService.uploadReviewImage(testFile, userId);
console.log('Image URL:', url);

// Try opening URL in browser (should show image)
```

---

### Issue: Real-time updates not instant

**Expected:** 500ms - 2s delay (normal)
**Actual:** 10s+ delay (issue)

**Causes:**
1. Replication not enabled (see Error 5 above)
2. Too many subscriptions (limit: 100 per client)
3. Network slow (check connection)

**Solution:**
```typescript
// Limit subscriptions (unsubscribe when component unmounts)
useEffect(() => {
  const subscription = ratingService.subscribeToRecipeRatings(
    recipeSlug,
    handleUpdate
  );

  return () => {
    subscription.unsubscribe(); // IMPORTANT!
  };
}, [recipeSlug]);
```

---

### Issue: "Too many requests" error

**Symptoms:**
```
FetchError: rate limit exceeded
```

**Cause:** Hitting Supabase free tier limits

**Limits:**
- Requests: Unlimited (but throttled if abusive)
- Storage: 1GB
- Bandwidth: 2GB/month

**Solution:**
1. Add debouncing:
   ```typescript
   const debouncedSearch = debounce(searchReviews, 500);
   ```

2. Cache results (React Query):
   ```typescript
   const { data } = useQuery(['reviews', recipeSlug], {
     staleTime: 5 * 60 * 1000 // Cache for 5 minutes
   });
   ```

3. Optimize queries (use `select` to limit columns)

---

## Getting Help

### Supabase Support
- **Docs:** https://supabase.com/docs
- **Discord:** https://discord.supabase.com
- **GitHub:** https://github.com/supabase/supabase/discussions

### React Testing
- **Testing Library Docs:** https://testing-library.com
- **Vitest Docs:** https://vitest.dev

### Project Help
- Check existing Sprint 1-2 tests for patterns
- Review `sprint3-implementation-plan.md`
- Ask in team chat/stand-up

---

**Last Updated:** 2026-01-07
**Status:** Ready for Sprint 3
