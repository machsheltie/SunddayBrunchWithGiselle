# Supabase Setup Guide - Sunday Brunch with Giselle

**Sprint 4: User Reviews & Ratings**
**Last Updated:** 2026-01-09

---

## 🎯 Overview

This guide walks you through setting up Supabase for authentication, database, and storage functionality in the Sunday Brunch with Giselle application.

**What is Supabase?**
Supabase is an open-source Firebase alternative that provides:
- **Authentication** - User signup/login with email/password
- **Database** - PostgreSQL database with real-time subscriptions
- **Storage** - File storage for user-uploaded images
- **Row Level Security (RLS)** - Database-level security policies

---

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase

1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Verify your email address

### 1.2 Create New Project

1. Click "New Project" in the dashboard
2. Fill in project details:
   - **Organization:** Create new or select existing
   - **Project Name:** `sunday-brunch-with-giselle`
   - **Database Password:** Generate a strong password (save this!)
   - **Region:** Choose closest to your users (e.g., `us-east-1`)
   - **Pricing Plan:** Free tier is sufficient for development

3. Click "Create new project"
4. Wait ~2 minutes for project provisioning

### 1.3 Get Project Credentials

Once your project is ready:

1. Go to **Settings** (⚙️) → **API**
2. Copy the following values:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public:** `eyJxxx...` (your anonymous/public key)

**Important:** The `anon` key is safe to expose publicly because it's protected by Row Level Security (RLS) policies.

---

## Step 2: Configure Local Environment

### 2.1 Create .env.local File

1. Navigate to the project root directory
2. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` in your editor
4. Update the Supabase variables with your credentials:
   ```bash
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx-your-anon-key-here
   ```

5. Save the file

**Verification:**
```bash
# Check that variables are set (should NOT show "undefined")
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

---

## Step 3: Enable Email Authentication

### 3.1 Configure Auth Settings

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Email** provider
3. Enable "Email" toggle
4. Configure settings:
   - **Enable Email Confirmations:** OFF (for MVP, turn ON for production)
   - **Secure email change:** ON
   - **Secure password change:** ON

### 3.2 Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:5173` (for development)
3. Add **Redirect URLs:**
   - `http://localhost:5173/**`
   - `https://your-production-domain.com/**` (add later)

### 3.3 Customize Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize templates for:
   - **Confirm signup** - Welcome email
   - **Magic Link** - Passwordless login (if using)
   - **Change Email Address** - Email change confirmation
   - **Reset Password** - Password reset link

**Example Custom Welcome Email:**
```html
<h2>Welcome to Sunday Brunch with Giselle!</h2>
<p>Thanks for joining our baking community.</p>
<p>Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

---

## Step 4: Set Up Database Schema

### 4.1 Create Profiles Table

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Paste the following SQL:

```sql
-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Stores user profile information
-- Automatically created when a user signs up (via trigger)

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================================

CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1) -- Use email username as initial display name
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_user();

-- ============================================================================
-- FUNCTION: Update updated_at timestamp
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

4. Click "Run" to execute
5. Verify success: "Success. No rows returned"

### 4.2 Create Ratings Table

1. Click "New Query" in SQL Editor
2. Paste the following SQL:

```sql
-- ============================================================================
-- RATINGS TABLE
-- ============================================================================
-- Stores user ratings for recipes (1-5 stars)
-- One rating per user per recipe

CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_slug, user_id) -- One rating per user per recipe
);

-- Enable Row Level Security
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ratings
-- Anyone can read ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

-- Users can insert their own ratings
CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete their own ratings"
  ON ratings FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- VIEW: Recipe ratings aggregation
-- ============================================================================
-- Provides average rating and count for each recipe

CREATE VIEW recipe_ratings AS
SELECT
  recipe_slug,
  COUNT(*) as rating_count,
  ROUND(AVG(rating)::NUMERIC, 2) as average_rating,
  COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
  COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
  COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
  COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
  COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
FROM ratings
GROUP BY recipe_slug;

-- Trigger to update updated_at on ratings
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

3. Click "Run"

### 4.3 Create Reviews Table

1. Click "New Query"
2. Paste the following SQL:

```sql
-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
-- Stores user reviews for recipes with optional images

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_slug TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT NOT NULL CHECK (LENGTH(title) <= 100),
  content TEXT NOT NULL CHECK (LENGTH(content) >= 50 AND LENGTH(content) <= 1000),
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reviews
-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert their own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- REVIEW VOTES TABLE
-- ============================================================================
-- Stores helpful/not helpful votes on reviews

CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id) -- One vote per user per review
);

-- Enable Row Level Security
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for review_votes
-- Anyone can read votes
CREATE POLICY "Review votes are viewable by everyone"
  ON review_votes FOR SELECT
  USING (true);

-- Users can insert their own votes
CREATE POLICY "Users can vote on reviews"
  ON review_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own votes
CREATE POLICY "Users can update their own votes"
  ON review_votes FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete their own votes"
  ON review_votes FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTION: Update helpful_count when votes change
-- ============================================================================

CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.vote_type = 'helpful' THEN
    UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
  ELSIF TG_OP = 'DELETE' AND OLD.vote_type = 'helpful' THEN
    UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type = 'helpful' AND NEW.vote_type = 'not_helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = NEW.review_id;
    ELSIF OLD.vote_type = 'not_helpful' AND NEW.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update helpful count
CREATE TRIGGER update_helpful_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- Trigger to update updated_at on reviews
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
```

3. Click "Run"

### 4.4 Verify Database Setup

1. Go to **Table Editor**
2. Verify tables exist:
   - ✅ profiles
   - ✅ ratings
   - ✅ reviews
   - ✅ review_votes

3. Check **Database** → **Tables** for schema details

---

## Step 5: Configure Storage for Review Images

### 5.1 Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Fill in details:
   - **Name:** `review-images`
   - **Public bucket:** ✅ Yes (images will be publicly viewable)
   - **File size limit:** 5 MB
   - **Allowed MIME types:** `image/*`

4. Click "Create bucket"

### 5.2 Set Up Storage Policies

1. Click on the `review-images` bucket
2. Go to **Policies** tab
3. Click "New Policy"
4. Create policies for authenticated users:

**Policy 1: Upload Images**
```sql
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'review-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

**Policy 2: Update Images**
```sql
-- Allow users to update their own images
CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'review-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

**Policy 3: Delete Images**
```sql
-- Allow users to delete their own images
CREATE POLICY "Users can delete their own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'review-images'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

**Policy 4: Read Images**
```sql
-- Allow everyone to read images (public bucket)
CREATE POLICY "Images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');
```

---

## Step 6: Test Supabase Connection

### 6.1 Test from Browser Console

1. Start your development server:
   ```bash
   cd sunday-brunch-website
   npm run dev
   ```

2. Open http://localhost:5173
3. Open browser DevTools (F12)
4. Run in console:
   ```javascript
   import { supabase, isSupabaseConfigured } from './src/lib/supabase'

   // Check configuration
   console.log('Supabase configured:', isSupabaseConfigured())

   // Test connection
   const { data, error } = await supabase.auth.getSession()
   console.log('Session:', data, 'Error:', error)
   ```

### 6.2 Expected Results

- **Configured:** `true`
- **Session:** `{ session: null }` (no user logged in yet)
- **Error:** `null`

If you see errors, check:
- ✅ .env.local file exists and has correct values
- ✅ Environment variables are prefixed with `VITE_`
- ✅ Development server was restarted after .env.local changes

---

## Step 7: Configure Netlify Environment Variables (Production)

When ready to deploy to production:

1. Go to Netlify dashboard → Your site → **Site settings** → **Environment variables**
2. Click "Add a variable"
3. Add Supabase variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

4. Update Site URL in Supabase:
   - Go to Supabase **Authentication** → **URL Configuration**
   - Add your production URL: `https://your-site.netlify.app`
   - Add redirect URL: `https://your-site.netlify.app/**`

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
1. Check `.env.local` exists in project root
2. Verify variables are prefixed with `VITE_`
3. Restart development server

### Issue: "Failed to fetch"

**Solution:**
1. Check Supabase project is active (not paused)
2. Verify URL and anon key are correct
3. Check browser network tab for CORS issues

### Issue: "Row Level Security policy violation"

**Solution:**
1. Go to Supabase **Table Editor**
2. Click on the table → **RLS**
3. Verify policies are created and enabled

### Issue: "Email not sent"

**Solution:**
1. Check **Authentication** → **Email Templates**
2. Verify SMTP settings (if using custom SMTP)
3. Check Supabase email quota (free tier: 3 emails/hour)

---

## Next Steps

✅ Supabase project created and configured
✅ Database schema set up (profiles, ratings, reviews)
✅ Storage bucket configured for images
✅ Environment variables set in .env.local

**Ready for development:**
1. Create AuthContext and authentication hooks
2. Build authentication UI components (Login, Signup)
3. Implement protected routes
4. Create user profile management
5. Build rating and review components

---

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/overview)

**Need help?** Check the Supabase Discord or documentation.
