# Supabase Database Setup Guide - Sprint 4 Week 1

## 🎯 Overview

This guide walks you through setting up the Supabase database for **Sunday Brunch with Giselle** Sprint 4 (User Authentication & Reviews).

**Estimated Time:** 15-20 minutes
**Prerequisites:** Supabase account, project created

---

## Step 1: Verify Supabase Configuration ✅

Your Supabase project is already configured:
- **Project URL:** https://yoyyojzywqnkxgfzfxic.supabase.co
- **Environment Variables:** Set in `.env.local`
- **Client Library:** Installed and configured in `src/lib/supabase.js`

**Verify your `.env.local` file contains:**
```bash
VITE_SUPABASE_URL=https://yoyyojzywqnkxgfzfxic.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## Step 2: Run Database Migration Script 🗄️

### 2.1 Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/yoyyojzywqnkxgfzfxic)
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**

### 2.2 Copy and Run the Migration Script

1. Open the file: `supabase_sprint4_setup.sql` (in project root)
2. Copy the **entire contents** of the file
3. Paste into the SQL Editor
4. Click **"Run"** (or press `Ctrl+Enter`)

**Expected Result:** "Success. No rows returned"

### 2.3 Verify Tables Created

Run this verification query in SQL Editor:

```sql
SELECT
  schemaname,
  tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'ratings', 'reviews', 'review_votes')
ORDER BY tablename;
```

**Expected Output:** 4 tables listed
- `profiles`
- `ratings`
- `reviews`
- `review_votes`

---

## Step 3: Verify Row Level Security (RLS) Policies 🔒

### 3.1 Check Profiles Table

1. Go to **Table Editor** → `profiles` table
2. Click **"Settings"** (gear icon)
3. Verify **"Enable Row Level Security"** is ON
4. Click **"Policies"** tab
5. Verify 3 policies exist:
   - "Profiles are viewable by everyone" (SELECT)
   - "Users can insert their own profile" (INSERT)
   - "Users can update their own profile" (UPDATE)

### 3.2 Check Ratings Table

1. Go to **Table Editor** → `ratings` table
2. Verify RLS is enabled
3. Verify 4 policies exist:
   - "Ratings are viewable by everyone" (SELECT)
   - "Users can insert their own ratings" (INSERT)
   - "Users can update their own ratings" (UPDATE)
   - "Users can delete their own ratings" (DELETE)

### 3.3 Check Reviews Table

1. Go to **Table Editor** → `reviews` table
2. Verify RLS is enabled
3. Verify 4 policies exist:
   - "Reviews are viewable by everyone" (SELECT)
   - "Users can insert their own reviews" (INSERT)
   - "Users can update their own reviews" (UPDATE)
   - "Users can delete their own reviews" (DELETE)

### 3.4 Check Review Votes Table

1. Go to **Table Editor** → `review_votes` table
2. Verify RLS is enabled
3. Verify 4 policies exist:
   - "Review votes are viewable by everyone" (SELECT)
   - "Users can vote on reviews" (INSERT)
   - "Users can update their own votes" (UPDATE)
   - "Users can delete their own votes" (DELETE)

---

## Step 4: Test Database Connection from Frontend 🧪

### 4.1 Run the Connection Test Script

From the project root:

```bash
cd sunday-brunch-website
npm run test:supabase
```

**Expected Output:**
```
✅ Supabase connection successful
✅ Tables accessible: profiles, ratings, reviews, review_votes
✅ RLS policies working correctly
✅ Database setup complete!
```

### 4.2 Manual Test (If Automated Test Not Available)

1. Start the dev server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Open browser console (F12)
4. Run this test:

```javascript
// Test Supabase connection
const testConnection = async () => {
  const { data, error } = await window.supabase.from('profiles').select('id').limit(1)
  if (error) {
    console.error('❌ Connection failed:', error)
  } else {
    console.log('✅ Supabase connection successful!')
  }
}
testConnection()
```

**Expected:** "✅ Supabase connection successful!"

---

## Step 5: Configure Supabase Auth Settings ⚙️

### 5.1 Enable Email/Password Authentication

1. Go to **Authentication** → **Providers**
2. Find **"Email"** provider
3. Ensure it's **enabled** (toggle should be ON)
4. Configure:
   - ✅ Enable email confirmations: **ON** (optional for development)
   - ✅ Enable password recovery: **ON**
   - ✅ Secure email change: **ON**

### 5.2 Configure Site URL and Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL:** `http://localhost:5173` (development) or your production URL
3. Add **Redirect URLs:**
   - `http://localhost:5173/**` (development)
   - `https://your-netlify-site.netlify.app/**` (production)

### 5.3 Customize Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize templates:
   - **Confirm signup** - Welcome email with verification link
   - **Magic Link** - Passwordless login email
   - **Change Email Address** - Email change confirmation
   - **Reset Password** - Password reset instructions

**Recommendation:** Use default templates for now, customize later.

---

## Step 6: Set Up Storage Bucket (For Review Images) 📸

### 6.1 Create Storage Bucket

1. Go to **Storage** → **"Create a new bucket"**
2. Configure:
   - **Name:** `review-images`
   - **Public bucket:** ✅ YES (images need to be publicly viewable)
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/jpeg, image/png, image/webp, image/gif`

### 6.2 Configure Storage Policies

1. Click on `review-images` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"** and create these policies:

**Policy 1: Allow authenticated users to upload images**
```sql
-- Policy for INSERT
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'review-images'
  AND auth.uid() IS NOT NULL
);
```

**Policy 2: Allow users to delete their own images**
```sql
-- Policy for DELETE
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'review-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

**Policy 3: Public access to read images**
```sql
-- Policy for SELECT
CREATE POLICY "Public access to review images"
ON storage.objects FOR SELECT
USING (bucket_id = 'review-images');
```

---

## Step 7: Verify Authentication Flow 🔐

### 7.1 Test Sign Up

1. Start dev server: `npm run dev`
2. Click **"Sign In"** button in top right
3. Click **"Sign Up"** tab
4. Fill in:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
   - Display Name: `Test User`
5. Click **"Sign Up"**

**Expected:**
- ✅ User redirected to home page
- ✅ User menu appears in top right (with avatar and name)
- ✅ User profile created in `profiles` table

### 7.2 Check Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Verify test user appears in list
3. Click on user to see details

**Expected:**
- Email: `test@example.com`
- Email confirmed: ✅ (if confirmations enabled)
- Created at: Recent timestamp

### 7.3 Check Profiles Table

1. Go to **Table Editor** → `profiles`
2. Verify profile row created for test user

**Expected Columns:**
- `id`: UUID matching auth user ID
- `email`: `test@example.com`
- `display_name`: `Test User` (or email username)
- `avatar_url`: NULL (no avatar uploaded yet)
- `bio`: NULL
- `created_at`: Recent timestamp
- `updated_at`: Recent timestamp

### 7.4 Test Sign Out and Sign In

1. Click user menu → **"Sign Out"**
2. Verify user menu disappears
3. Click **"Sign In"** button
4. Enter credentials:
   - Email: `test@example.com`
   - Password: `TestPassword123!`
5. Click **"Sign In"**

**Expected:**
- ✅ User signed in successfully
- ✅ User menu reappears
- ✅ No errors in console

---

## Step 8: Test Database Operations 📝

### 8.1 Test Rating Submission (via Console)

1. Open browser console (F12)
2. Run this test:

```javascript
// Test rating submission
const testRating = async () => {
  const { data, error } = await window.supabase
    .from('ratings')
    .insert({
      recipe_slug: 'chocolate-chip-cookies',
      rating: 5
    })
    .select()

  if (error) {
    console.error('❌ Rating failed:', error)
  } else {
    console.log('✅ Rating submitted:', data)
  }
}

testRating()
```

**Expected:** "✅ Rating submitted" with data object

### 8.2 Verify Rating in Database

1. Go to **Table Editor** → `ratings`
2. Verify rating row exists:
   - `recipe_slug`: `chocolate-chip-cookies`
   - `user_id`: Your test user UUID
   - `rating`: 5

### 8.3 Test Rating Aggregation View

Run this query in SQL Editor:

```sql
SELECT * FROM recipe_ratings WHERE recipe_slug = 'chocolate-chip-cookies';
```

**Expected Output:**
- `recipe_slug`: `chocolate-chip-cookies`
- `rating_count`: 1
- `average_rating`: 5.00
- `five_star`: 1
- `four_star`: 0
- `three_star`: 0
- `two_star`: 0
- `one_star`: 0

---

## Troubleshooting 🔧

### Issue: "No rows returned" when running migration

**Solution:** This is expected! The migration creates tables but doesn't insert data. Verify tables exist using the verification query.

### Issue: RLS policy errors when testing

**Solution:**
1. Verify user is authenticated (check `supabase.auth.getUser()`)
2. Verify RLS policies exist (Table Editor → Policies tab)
3. Check policy conditions match your test case

### Issue: Storage upload fails

**Solution:**
1. Verify bucket is public
2. Verify storage policies are created
3. Check file size is under 5MB
4. Verify MIME type is allowed

### Issue: Profile not created on signup

**Solution:**
1. Check trigger exists: SQL Editor → `SELECT * FROM pg_trigger WHERE tgname = 'create_profile_trigger';`
2. Verify function exists: `SELECT * FROM pg_proc WHERE proname = 'create_profile_for_user';`
3. Re-run migration script if needed

---

## Success Criteria ✅

Your database setup is complete when:

- ✅ All 4 tables created (`profiles`, `ratings`, `reviews`, `review_votes`)
- ✅ RLS enabled on all tables (16 policies total)
- ✅ Profile trigger working (auto-creates profile on signup)
- ✅ Storage bucket created (`review-images`)
- ✅ Storage policies configured (3 policies)
- ✅ Authentication flow working (signup, login, logout)
- ✅ Database connection test passing
- ✅ Can submit ratings and reviews

---

## Next Steps 🚀

After database setup is complete:

1. **Update @fix_plan.md** - Mark "Complete Database Setup" as done `[x]`
2. **Run tests** - `npm test` (verify 667/722 passing)
3. **Implement ProtectedRoute component** (see Sprint 4 plan)
4. **Write authentication tests** (50+ tests target)
5. **End-to-end testing** (complete authentication flow)

---

## Reference: Database Schema Summary

### Profiles Table
- Stores user profile information
- Auto-created on signup via trigger
- Users can update their own profile

### Ratings Table
- Stores 1-5 star ratings
- One rating per user per recipe
- Users can update/delete own ratings

### Reviews Table
- Stores written reviews with optional images
- Includes title, content, rating
- Users can update/delete own reviews

### Review Votes Table
- Stores helpful/not helpful votes
- One vote per user per review
- Updates review `helpful_count` automatically

### Recipe Ratings View
- Aggregates ratings per recipe
- Shows average rating and distribution
- Read-only view

---

**Setup Guide Version:** 1.0
**Last Updated:** 2026-01-13
**Sprint:** Sprint 4 Week 1
